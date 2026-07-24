import { createSelectSchema } from "drizzle-orm/zod";
import { tokens } from "../../drizzle/schema";

export const tokenApiObject = createSelectSchema(tokens).omit({
  tokenHash: true
}).openapi("token")
