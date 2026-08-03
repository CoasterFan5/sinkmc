import { ContentfulStatusCode } from "hono/utils/http-status";

export const errorBuilder = <T extends string>(code: T, message: string) => {
  return {
    code: code,
    message: "Database error",
  }
}
