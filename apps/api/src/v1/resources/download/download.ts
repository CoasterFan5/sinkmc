import { Hono } from "hono";
import { resourceLookup } from "../../../utils/resourceLookup";
import { artifactsTable } from "../../../drizzle/schema";
import { and, desc, eq, SQL } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { stream } from "hono/streaming";

export const resourceDownloads = new Hono<{
  Bindings: CloudflareBindings;
}>().get(
  "/:resourceLocator/download",
  zValidator(
    "query",
    z.object({
      hash: z.string().optional(),
    }),
  ),
  async (c) => {
    // TODO: Add filter for programatic downloads on the right platform and version

    const { resource, db } = await resourceLookup(
      c.req.param("resourceLocator"),
      c.env,
    );

    if (!resource.ok) {
      return c.json(
        {
          message: "Failed lookup",
        },
        500,
      );
    }

    if (!resource.data) {
      return c.json(
        {
          message: "Not Found",
        },
        404,
      );
    }

    const { hash } = c.req.valid("query");

    const filters: SQL[] = [eq(artifactsTable.resourceId, resource.data.id)];

    if (hash) {
      filters.push(eq(artifactsTable.hash, hash))
    }

    const artifact = await db
      .select()
      .from(artifactsTable)
      .where(and(...filters))
      .orderBy(desc(artifactsTable.createdAt))
      .get();

    if (!artifact) {
      return c.json({
        message: 'Not found'
      }, 404)
    }

    const file = await c.env.pluginBucket.get(artifact?.fileKey)
    if (!file) {
      return c.json({
        message: "Issue getting file"
      }, 500)
    }

    return new Response(file.body, {
      headers: {
        "Content-type": artifact.contentType,
        "Content-Disposition": `attachment; filename=${artifact.name}`
      }
    })
  },
);
