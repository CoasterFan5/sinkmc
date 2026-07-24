import { OpenAPIHono, z } from "@hono/zod-openapi";
import { getSession_schema } from "./schema";

export const sessionRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>()
sessionRoute.openapi(
  getSession_schema,
  async (c) => {
    const u = c.get("user");
    const tokenData = c.get("tokenData");

    return c.json({
      user: u,
      session: tokenData,
    });
  }
)
