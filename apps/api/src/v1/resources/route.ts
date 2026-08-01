import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { resources_get_schema } from "./schema";
import { getDb } from "../../drizzle/db";
import { resourcesTable } from "../../drizzle/schema";
import { and, eq, type SQL } from "drizzle-orm";
import { safeDbQuery } from "../../lib/safeDbQuery";
import { singleResourceRouter } from "./:locator/route";

export const resourcesRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>()
resourcesRoute.route("/:locator", singleResourceRouter)
resourcesRoute.openapi(resources_get_schema, async (c) => {
  const db = getDb(c.env);

  const filters: SQL[] = [];

  const { ownerId } = c.req.valid("query");

  if (ownerId) {
    filters.push(eq(resourcesTable.ownerId, ownerId));
  }

  const items = await safeDbQuery(async () => {
    return db
      .select()
      .from(resourcesTable)
      .where(and(...filters))
  })

  if (!items.ok) {
    return c.json({
      code: "INTERNAL_ERROR" as const,
      message: "Something went wrong."
    }, 500)
  }

  return c.json({
    resources: items.data,
  }, 200)
});
