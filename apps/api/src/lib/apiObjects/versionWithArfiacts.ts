import z from "zod";
import { artifactApiObject } from "./artifact";
import { versionApiObject } from "./version";

const o = versionApiObject.extend({
  artifacts: z.array(artifactApiObject)
})

const ex: z.infer<typeof o> = {
  id: "ver_0",
  ownerId: "_",
  resourceId: "_",
  versionString: "1.0.0",
  description: "A description of this version.",
  createdAt: new Date(1785602425000),
  artifacts: [{
    id: "artifact_0",
    versionId: "ver_0",
    resourceId: "_",
    supportedVersions: ["1.8.9", "1.9.1"],
    platforms: ['Paper'],
    hash: "_",
    fileKey: "internal_property",
    name: "plugin.jar",
    fileSize: 0,
    contentType: "application/octet-stream",
    createdAt: new Date(1785602425000)
  },
  {
    id: "artifact_3746",
    versionId: "ver_0",
    resourceId: "_",
    supportedVersions: ["1.8.2", "1.8.9", "1.9.1"],
    platforms: ['Bukkit', 'Spigot'],
    hash: "_",
    fileKey: "internal_property",
    name: "plugin-bukkit.jar",
    fileSize: 0,
    contentType: "application/octet-stream",
    createdAt: new Date(1785602425000)
  }]
}

export const versionWithArtifactsApiObject = o.openapi({
  example: ex
})
