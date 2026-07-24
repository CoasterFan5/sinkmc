import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { z } from "@hono/zod-openapi"

const statusReturn = z.object({
  message: z.string()
}).openapi("status")

const statusRoute = createRoute({
  method: "get",
  path: "/status",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: statusReturn
        }
      },
      description: "Looking Good!"
    }
  }
})

export const status = new OpenAPIHono<{ Bindings: CloudflareBindings }>()

status.openapi(statusRoute, async (c) => {
  return c.json({
    message: "Looking good!"
  }, 200)
})
