import { createSelectSchema } from "drizzle-orm/zod";
import { resourcesTable } from "../../drizzle/schema";

const resourceApiObjectExample: typeof resourcesTable.$inferSelect = {
  id: "_",
  ownerId: "_",
  name: "My Cool Plugin",
  slug: "my-cool-plugin",
  description: "A very very neat plugin",
  category: "Mechanics",
  price: 0,
  createdAt: new Date(1785602425000),
  updatedAt: new Date(1785602425000)
}

export const resourceApiObject = createSelectSchema(resourcesTable).openapi({
  example: resourceApiObjectExample
})
