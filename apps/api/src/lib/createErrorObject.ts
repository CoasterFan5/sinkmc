import { z } from "@hono/zod-openapi"

export const createErrorSchemaObject = <T extends string[]>(codes: T) => {
  return z.object({
    code: z.enum(codes),
    message: z.string()
  })
}
