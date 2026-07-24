import { createRoute, z } from "@hono/zod-openapi";
import { createAuthMiddleware } from "../../lib/authMiddleware";
import { userApiObject } from "../../lib/apiObjects/user";
import { tokenApiObject } from "../../lib/apiObjects/token";

const sessionReturnSchema = z.object({
  user: userApiObject,
  session: tokenApiObject,
}).openapi("sessionResp")

const authMiddleware = createAuthMiddleware(["versions:write"])

export const getSession_schema = createRoute({
  method: "get",
  path: "/",
  security: [authMiddleware.securityObject],
  middleware: [authMiddleware.middleware] as const,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: sessionReturnSchema
        }
      },
      description: "Details about the user and token used to acquire the user.",
    },
  }
})
