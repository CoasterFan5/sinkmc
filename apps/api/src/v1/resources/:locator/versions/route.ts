import { OpenAPIHono } from "@hono/zod-openapi";
import { resource_get_schema } from "./schema"
import { resourceLookup } from "../../../../lib/resourceLookup";
import { getDb } from "../../../../drizzle/db";
import { safeDbQuery } from "../../../../lib/safeDbQuery";
import { artifactsTable, versionsTable } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { errorBuilder } from "../../../../lib/errorBuilder";

export const resourceVersionsRouter = new OpenAPIHono<{
  Bindings: CloudflareBindings
}>()
resourceVersionsRouter.openapi(resource_get_schema, async (c) => {
  const { locator } = c.req.valid("param");


  const { resource } = await resourceLookup(locator, c.env);

  if (!resource.ok) {
    return c.json(
      {
        code: "INTERNAL_ERROR" as const,
        message: "Database error",
      },
      500,
    );
  }

  const resourceData = resource.data

  if (!resourceData) {
    return c.json(
      errorBuilder("RESOURCE_NOT_FOUND", "Resource not found"),
      404,
    );
  }

  const db = getDb(c.env)
  const versions = await safeDbQuery(async () => db.select().from(versionsTable).where(eq(versionsTable.resourceId, resourceData.id)))

  if (!versions.ok) {
    return c.json(
      errorBuilder("INTERNAL_ERROR", "Database Error"),
      500,
    );
  }

  const artifacts = await db.select().from(artifactsTable).where(eq(artifactsTable.resourceId, resourceData.id))
  const artifactsByVersionid: Record<string, (typeof artifacts)> = {}
  for (const artifact of artifacts) {
    if (!artifactsByVersionid[artifact.versionId]) {
      artifactsByVersionid[artifact.versionId] = []
    }
    artifactsByVersionid[artifact.versionId].push(artifact)

  }

  const mappedVersions = versions.data.map((item) => {
    return {
      ...item,
      ...{ artifacts: artifactsByVersionid[item.id] ?? [] }
    }
  })



  return c.json({
    versions: mappedVersions
  }, 200)
})
