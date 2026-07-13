import { Hono } from "hono";
import { auth } from "../../utils/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { checkScopes } from "../../utils/scopes";
import { categories } from "@repo/taxonomy";
import { getDb } from "../../drizzle/db";
import { resourcesTable } from "../../drizzle/schema";
import { safeDbQuery } from "../../utils/safeDbQuery";
import { eq } from "drizzle-orm";

const categoryEnum = z.enum(categories);

const newResourceZodValidator = zValidator(
  "json",
  z.object({
    name: z.string().min(1).max(128),
    category: categoryEnum,
    slug: z.string().min(3).max(32),
    description: z.string().min(10).max(256),
  }),
);

export const newResourceRouter = new Hono<{ Bindings: CloudflareBindings }>()
  .use(auth)
  .post("/", newResourceZodValidator, async (c) => {
    // check for permissions
    const { name, category, slug, description } = c.req.valid("json");

    const tokenData = c.get("tokenData");
    if (!checkScopes(tokenData.scopes, "resources:write")) {
      return c.json(
        {
          message: "Missing scope",
        },
        401,
      );
    }

    const user = c.get("user");

    const db = getDb(c.env);
    // check if the slug is already taken
    const slugCheck = await safeDbQuery(
      db.select().from(resourcesTable).where(eq(resourcesTable.slug, slug)).get,
    );
    if (!slugCheck.ok) {
      return c.json(
        {
          message: "Internal Database Error",
        },
        500,
      );
    }

    if (slugCheck.data) {
      return c.json(
        {
          message: "Slug in use.",
        },
        400,
      );
    }

    try {
      const r = await db
        .insert(resourcesTable)
        .values({
          ownerId: user.id,
          name: name,
          category,
          slug,
          description,
        })
        .returning();
      return c.json({
        message: "resource created",
        resource: r[0],
      });
    } catch (e) {
      return c.json(
        {
          message: "Error creating resources",
        },
        500,
      );
    }
  });
