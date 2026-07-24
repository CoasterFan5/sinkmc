import { createRoute } from "@hono/zod-openapi"
import { z } from "@hono/zod-openapi"
import { app } from "./utils/honoApp"

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

app.openapi(statusRoute, async (c) => {
  return c.json({
    message: "Looking good!"
  }, 200)
})
