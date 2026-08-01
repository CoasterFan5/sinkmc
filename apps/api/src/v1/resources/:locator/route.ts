import { OpenAPIHono } from "@hono/zod-openapi";
import { resource_get_schema } from "./schema"
import { resourceLookup } from "../../../lib/resourceLookup";

export const singleResourceRouter = new OpenAPIHono<{
  Bindings: CloudflareBindings
}>()
singleResourceRouter.openapi(resource_get_schema, async (c) => {
  const { locator } = c.req.valid("param");


  const { resource } = await resourceLookup(locator, c.env);

  if (!resource.ok) {
    return c.json(
      {
        code: "INTERNAL_ERROR" as const,
        message: "Database error",
      },
      500,
    );
  }

  if (!resource.data) {
    return c.json(
      {
        code: "NOT_FOUND" as const,
        message: "Resource not found",
      },
      404,
    );
  }

  return c.json({
    resource: resource.data
  }, 200)
})
