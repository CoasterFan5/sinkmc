import { Hono } from "hono";
import { auth } from "../../utils/authMiddleware";

/**
 * Get a user by the id specified in the uri, or use @me to get the current user.
 */
export const user = new Hono<{ Bindings: CloudflareBindings }>()
  .use(auth)
  .get("/session/", async (c) => {
    const u = c.get("user");
    const tokenData = c.get("tokenData");

    return c.json({
      user: u,
      tokenData,
    });
  });
