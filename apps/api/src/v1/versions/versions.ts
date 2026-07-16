import { zValidator } from "@hono/zod-validator";
import { taxonomy } from "@repo/taxonomy";
import { Hono } from "hono";
import z from "zod";
import { auth } from "../../utils/authMiddleware";
import { PluginInfo, pluginParser } from "./_utils/pluginParser";
import { safeDbQuery } from "../../utils/safeDbQuery";
import {
  artifactsTable,
  resourcesTable,
  versionsTable,
} from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";
import { checkScopes } from "../../utils/scopes";
import crypto from "crypto";
import { versionsZodValidator } from "./_utils/formZodObject";
import { getDb } from "../../drizzle/db";

export const versions = new Hono<{
  Bindings: CloudflareBindings;
}>()
  .use(auth)
  .post("/", versionsZodValidator, async (c) => {
    const rawBody = await c.req.formData();
    const body = c.req.valid("form");

    // Auth checks, these are first because compared to parsing jars, this is relatively cheap

    // check token scopes
    const scopeCheck = checkScopes(c.get("tokenData").scopes, "versions:write");
    if (!scopeCheck) {
      return c.json(
        {
          message: "Missing required scope",
        },
        401,
      );
    }

    const db = getDb(c.env);

    // Make sure that the owner of the token is the resource owner
    const resourceCheck = await safeDbQuery(
      db
        .select()
        .from(resourcesTable)
        .where(
          and(
            eq(resourcesTable.ownerId, c.get("user").id),
            eq(resourcesTable.id, body.resourceId),
          ),
        ).get,
    );

    if (!resourceCheck.ok) {
      return c.json(
        {
          message: "Database issue",
        },
        500,
      );
    }

    if (!resourceCheck.data) {
      return c.json(
        {
          message: "Token not authorized for this resource",
        },
        401,
      );
    }

    const basicFileInfo: {
      file: File;
      supportedVersions: string[];
      supportedPlatforms: (typeof taxonomy.platforms)[number][];
    }[] = [];

    const fullFileInfo: {
      file: File;
      hash: string;
      pluginDetails: PluginInfo;
      supportedVersions: string[];
      supportedPlatforms: (typeof taxonomy.platforms)[number][];
    }[] = [];

    for (const artifact of body.artifacts) {
      const fk = artifact.fileKey;
      const file = rawBody.get(fk);
      if (!(file instanceof File)) {
        return c.json(
          {
            message: `File key "${fk}" specified but does not exist.`,
          },
          400,
        );
      }
      basicFileInfo.push({
        file,
        supportedPlatforms: artifact.platforms,
        supportedVersions: artifact.supportedVersions,
      });
    }

    let versionString: string | undefined = undefined;
    for (const f of basicFileInfo) {
      // for each file, extract the plugin.yml
      const arrayBuffer = await f.file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      const pluginDetails = pluginParser(fileBuffer);
      if (pluginDetails.isError) {
        return c.json(
          {
            message: `Failed to parse plugin: ${pluginDetails.message}`,
          },
          400,
        );
      }
      if (versionString == undefined) {
        versionString = pluginDetails.version;
      } else if (versionString != pluginDetails.version) {
        return c.json(
          {
            message: `Versions must match between ALL artifacts, version ${versionString} does not match ${pluginDetails.version}`,
          },
          400,
        );
      }
      const hash = crypto.hash("sha512", fileBuffer);

      fullFileInfo.push({
        file: f.file,
        hash,
        pluginDetails: pluginDetails,
        supportedPlatforms: f.supportedPlatforms,
        supportedVersions: f.supportedVersions,
      });
    }

    // check if a version already exists
    const versionCheck = await safeDbQuery(
      db
        .select()
        .from(versionsTable)
        .where(
          and(
            eq(versionsTable.resourceId, resourceCheck.data.id),
            eq(versionsTable.versionString, versionString!),
          ),
        ).get,
    );

    if (!versionCheck.ok) {
      return c.json(
        {
          message: "Error checking version",
        },
        500,
      );
    }

    if (versionCheck.data) {
      return c.json(
        {
          message: "Version string in use for this resource",
        },
        400,
      );
    }

    // Upload our little jars to r2
    for (const toUpload of fullFileInfo) {
      await c.env.pluginBucket.put(`/pl/${toUpload.hash}`, toUpload.file);
    }

    // Every test has at this point passed, we just have to upload the jars and publish the version
    const versionInsert = await db
      .insert(versionsTable)
      .values({
        ownerId: resourceCheck.data.ownerId,
        resourceId: resourceCheck.data.id,
        versionString: versionString!,
        description: body.description,
      })
      .returning();
    const newVersion = versionInsert[0];

    const typeSafeCreate = (item: typeof artifactsTable.$inferInsert) => {
      return item;
    };

    await db.insert(artifactsTable).values(
      fullFileInfo.map((item) =>
        typeSafeCreate({
          versionId: newVersion.id,
          resourceId: newVersion.resourceId,
          supportedVersions: item.supportedVersions,
          platforms: item.supportedPlatforms,
          hash: item.hash,
          fileKey: `/pl/${item.hash}`,
        }),
      ),
    );

    return c.json(
      {
        message: "Done!",
      },
      200,
    );
  });
