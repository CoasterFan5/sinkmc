import { createSelectSchema } from "drizzle-orm/zod";
import { usersTable } from "../../drizzle/schema";

export const userApiObject = createSelectSchema(usersTable).openapi("user");
