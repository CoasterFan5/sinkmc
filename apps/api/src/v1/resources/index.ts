import { Hono } from "hono";
import { newResourceRouter } from "./create";
import { getDb } from "../../drizzle/db";
import { resourcesTable } from "../../drizzle/schema";
import { and, eq, getTableColumns, SQL } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { singleResourceRouter } from "./singleResource";
import { getResourceVersion } from "./versions/get";

// this is the resources/:location route

export const resourcesRouter = new Hono<{ Bindings: CloudflareBindings }>()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        slug: z.string().optional(),
        id: z.string().optional(),
        ownerId: z.string().optional(),
      }),
    ),
    async (c) => {
      const db = getDb(c.env);

      const filters: SQL[] = [];

      const { slug, id, ownerId } = c.req.valid("query");

      if (slug) {
        filters.push(eq(resourcesTable.slug, slug));
      }
      if (id) {
        filters.push(eq(resourcesTable.id, id));
      }
      if (ownerId) {
        filters.push(eq(resourcesTable.ownerId, ownerId));
      }

      const items = await db
        .select()
        .from(resourcesTable)
        .where(and(...filters));

      return c.json({
        resources: items,
      });
    },
  )
  .route("/", getResourceVersion)
  .route("/", singleResourceRouter)
  .route("/", newResourceRouter);
