import { and, eq, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import { resourcesTable } from "../../drizzle/schema";
import { safeDbQuery } from "../../utils/safeDbQuery";
import { getDb } from "../../drizzle/db";
import { resourceLookup } from "../../utils/resourceLookup";

export const singleResourceRouter = new Hono<{
  Bindings: CloudflareBindings;
}>().get("/:locator", async (c) => {
  const locator = c.req.param("locator");
  const { resource } = await resourceLookup(locator, c.env);

  if (!resource.ok) {
    return c.json(
      {
        message: "Database error",
      },
      500,
    );
  }

  if (!resource.data) {
    return c.json(
      {
        message: "Resource not found",
      },
      404,
    );
  }

  return c.json(resource.data);
});
