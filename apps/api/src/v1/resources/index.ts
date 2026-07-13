import { Hono } from "hono";
import { auth } from "../../utils/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { categories } from "@repo/taxonomy";
import { checkScopes } from "../../utils/scopes";

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

export const resources = new Hono<{ Bindings: CloudflareBindings }>()
  .get("/resources/:id", async (c) => {})
  .use(auth)
  .post("/resources", newResourceZodValidator, async (c) => {
    // check for permissions
    const tokenData = c.get("tokenData");
    if (!checkScopes(tokenData.scopes, "resources:write")) {
      return c.json({
        message: "Missing scope",
      });
    }

    const user = c.get("user");

    await db;
  });
