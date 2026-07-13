import { and, eq, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import { resourcesTable } from "../../drizzle/schema";
import { safeDbQuery } from "../../utils/safeDbQuery";
import { getDb } from "../../drizzle/db";

export const singleResourceRouter = new Hono<{
  Bindings: CloudflareBindings;
}>().get("/", async (c) => {
  const id = c.req.query("id");
  const slug = c.req.query("slug");

  if (!id && !slug) {
    return c.json(
      {
        message: "Missing id or slug",
      },
      400,
    );
  }

  const filters: SQL[] = [];
  if (id) {
    filters.push(eq(resourcesTable.id, id));
  } else if (slug) {
    filters.push(eq(resourcesTable.slug, slug));
  }
  const db = getDb(c.env);
  const item = await safeDbQuery(
    db
      .select()
      .from(resourcesTable)
      .where(and(...filters)).get,
  );

  if (!item.ok) {
    return c.json(
      {
        message: "Database error",
      },
      500,
    );
  }

  if (!item.data) {
    return c.json(
      {
        message: "Resource not found",
      },
      404,
    );
  }

  return c.json(item.data);
});
