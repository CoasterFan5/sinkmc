import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { resource_post_schema, resources_get_schema } from "./schema";
import { getDb } from "../../drizzle/db";
import { resourcesTable } from "../../drizzle/schema";
import { and, eq, type SQL } from "drizzle-orm";
import { safeDbQuery } from "../../lib/safeDbQuery";
import { singleResourceRouter } from "./:locator/route";
import { errorBuilder } from "../../lib/errorBuilder";

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

resourcesRoute.openapi(resource_post_schema, async (c) => {
  const { name, category, slug, description } = c.req.valid("json");
  const user = c.get("user");

  const db = getDb(c.env);
  const slugCheck = await safeDbQuery(
    db.select().from(resourcesTable).where(eq(resourcesTable.slug, slug)).get,
  );
  if (!slugCheck.ok) {
    return c.json(
      errorBuilder("INTERNAL_ERROR" as const, "Database error"),
      500,
    );
  }

  if (slugCheck.data) {
    return c.json(
      errorBuilder("SLUG_IN_USE" as const, "Slug is already in use."),
      409,
    );
  }

  const newResource = await safeDbQuery(() =>
    db.insert(resourcesTable).values({
      ownerId: user.id,
      name: name,
      category,
      slug,
      description,
    }).returning())


  if (!newResource.ok || newResource.data.length < 1) {
    return c.json(errorBuilder(
      "INTERNAL_ERROR" as const,
      "Error creating resource"
    ), 500)
  };

  const r = newResource.data[0]

  return c.json({
    resource: r
  }, 200)


})
