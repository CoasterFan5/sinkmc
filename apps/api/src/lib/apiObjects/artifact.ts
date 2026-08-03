import { createSelectSchema } from "drizzle-orm/zod";
import z from "zod";
import { artifactsTable } from "../../drizzle/schema";

const artifactExampleObject: typeof artifactsTable.$inferSelect = {
  id: "artifact_0",
  versionId: "_",
  resourceId: "_",
  supportedVersions: ["1.8.9", "1.9.1"],
  platforms: ['Paper'],
  hash: "_",
  fileKey: "internal_property",
  name: "plugin.jar",
  fileSize: 0,
  contentType: "application/octet-stream",
  createdAt: new Date(1785602425000)
}

export const artifactApiObject = createSelectSchema(artifactsTable).openapi({
  example: artifactExampleObject
})
