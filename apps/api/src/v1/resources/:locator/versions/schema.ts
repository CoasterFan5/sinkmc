import { createRoute, z } from "@hono/zod-openapi";
import { resourceApiObject } from "../../../../lib/apiObjects/resource";
import { createJsonContentSchema } from "../../../../lib/createJsonContentSchema";
import { createErrorSchemaObject } from "../../../../lib/createErrorObject";
import { versionApiObject } from "../../../../lib/apiObjects/version";
import { artifactApiObject } from "../../../../lib/apiObjects/artifact";
import { versionWithArtifactsApiObject } from "../../../../lib/apiObjects/versionWithArfiacts";

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
            versions: z.array(versionWithArtifactsApiObject)
          }),
        },
      },
      description: "A list of versions for a specific resource",
    },
    404: createJsonContentSchema(createErrorSchemaObject(["RESOURCE_NOT_FOUND"] as const), "Something is not found"),
    500: createJsonContentSchema(createErrorSchemaObject(["INTERNAL_ERROR"] as const), "Internal Error"),
  }
})
