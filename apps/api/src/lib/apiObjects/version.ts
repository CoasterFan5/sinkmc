import { createSelectSchema } from "drizzle-orm/zod";
import { versionsTable } from "../../drizzle/schema";


const versionExampleObject: typeof versionsTable.$inferSelect = {
  id: "ver_0",
  ownerId: "_",
  resourceId: "_",
  versionString: "1.0.0",
  description: "A description of this version.",
  createdAt: new Date(1785602425000)
}

export const versionApiObject = createSelectSchema(versionsTable).openapi({
  example: versionExampleObject
})
