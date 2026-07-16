import { and, eq, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import { resourcesTable } from "../../drizzle/schema";
import { safeDbQuery } from "../../utils/safeDbQuery";
import { getDb } from "../../drizzle/db";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

export const singleResourceRouter = new Hono<{
  Bindings: CloudflareBindings;
}>().get(
  "/:locator",
  zValidator(
    "query",
    z.object({
      type: z.enum(["slug", "id"]).optional(),
    }),
  ),
  async (c) => {
    let { type } = c.req.valid("query");
    const locator = c.req.param("locator");

    if (type == undefined) {
      type = "id";
    }

    const filters: SQL[] = [];
    if (type == "id") {
      filters.push(eq(resourcesTable.id, locator));
    } else if (type == "slug") {
      filters.push(eq(resourcesTable.slug, locator));
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
  },
);
