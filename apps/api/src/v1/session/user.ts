import { Hono } from "hono";
import { auth } from "../../utils/authMiddleware";

/**
 * Get a user by the id specified in the uri
 */
export const user = new Hono<{ Bindings: CloudflareBindings }>()
  .use(auth)
  .get("/", async (c) => {
    const u = c.get("user");
    const tokenData = c.get("tokenData");

    return c.json({
      user: u,
      session: tokenData,
    });
  });
