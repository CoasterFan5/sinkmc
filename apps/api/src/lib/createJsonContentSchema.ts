import { ZodType } from "zod/v4";

export const createJsonContentSchema = <T extends ZodType<unknown>>(schema: T, description: string) => {
  return {
    content: {
      "application/json": {
        schema
      }
    },
    description
  }
}
