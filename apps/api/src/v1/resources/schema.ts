import { createRoute, z } from "@hono/zod-openapi";
import { createErrorSchemaObject } from "../../lib/createErrorObject";
import { createJsonContentSchema } from "../../lib/createJsonContentSchema";
import { resourceApiObject } from "../../lib/apiObjects/resource";

const resourceRequestQueryParams = z.object({
  ownerId: z.string().optional().describe("Filter resources by ownerId"),
})

export const resources_get_schema = createRoute({
  method: "get",
  path: "/",
  request: {
    query: resourceRequestQueryParams
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            resources: z.array(resourceApiObject)
          }),
        },
      },
      description: "A list of resources",
    },
    500: createJsonContentSchema(createErrorSchemaObject(["INTERNAL_ERROR"] as const), "Internal Error"),
  }
})
