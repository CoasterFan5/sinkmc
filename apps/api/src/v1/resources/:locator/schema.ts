import { createRoute, z } from "@hono/zod-openapi";
import { resourceApiObject } from "../../../lib/apiObjects/resource";
import { createJsonContentSchema } from "../../../lib/createJsonContentSchema";
import { createErrorSchemaObject } from "../../../lib/createErrorObject";

export const resource_get_schema = createRoute({
  method: "get",
  path: "/",
  request: {
    params: z.object({
      "locator": z.string().openapi({
        example: "sink"
      })
    })
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            resource: resourceApiObject
          }),
        },
      },
      description: "A single resource",
    },
    404: createJsonContentSchema(createErrorSchemaObject(["NOT_FOUND"] as const), "Resource not found"),
    500: createJsonContentSchema(createErrorSchemaObject(["INTERNAL_ERROR"] as const), "Internal Error"),
  }
})
