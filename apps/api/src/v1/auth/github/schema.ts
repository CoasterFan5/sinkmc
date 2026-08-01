import { createRoute, z } from "@hono/zod-openapi";
import { createErrorSchemaObject } from "../../../lib/createErrorObject";
import { createJsonContentSchema } from "../../../lib/createJsonContentSchema";


export const auth_schema = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.string()
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
            token: z.string(),
            tokenHash: z.string(),
          }).openapi("authResponseSchema"),
        },
      },
      description: "A private route to handle generation of tokens and auth. This route will not work if the code query param is not generated using the correct oAuth app.",
    },
    400: createJsonContentSchema(createErrorSchemaObject(["BAD_TOKEN"] as const), "Bad Request"),
    401: createJsonContentSchema(createErrorSchemaObject(["EXPIRED_CREDENTIALS", "NO_VERIFIED_EMAIL"] as const), "Unauthorized"),
    500: createJsonContentSchema(createErrorSchemaObject(["INTERNAL_ERROR", "EXISTING_ACCOUNT"]), "Internal Error"),
  }
})
