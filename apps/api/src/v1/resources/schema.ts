import { createRoute, z } from "@hono/zod-openapi";
import { createErrorSchemaObject } from "../../lib/createErrorObject";
import { createJsonContentSchema } from "../../lib/createJsonContentSchema";
import { resourceApiObject } from "../../lib/apiObjects/resource";
import { categories } from "@repo/taxonomy";
import { createAuthMiddleware } from "../../lib/authMiddleware";

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

const authMiddleware = createAuthMiddleware(['resources:write'])
export const resource_post_schema = createRoute({
  method: "post",
  path: "/",
  middleware: [authMiddleware.middleware] as const,
  security: [authMiddleware.securityObject],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().min(1).max(128),
            category: z.enum(categories),
            slug: z.string().min(3).max(32),
            description: z.string().min(10).max(256),
          }),
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            resource: resourceApiObject
          })
        }
      },
      description: "The resource object that has been created"
    },
    409: createJsonContentSchema(createErrorSchemaObject(["SLUG_IN_USE"] as const), "Duplicate Item"),
    500: createJsonContentSchema(createErrorSchemaObject(["INTERNAL_ERROR"] as const), "Internal Error"),
  }
})
