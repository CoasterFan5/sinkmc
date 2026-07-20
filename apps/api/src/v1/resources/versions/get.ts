import { Hono } from "hono";
import { resourceLookup } from "../../../utils/resourceLookup";
import { artifactsTable, versionsTable } from "../../../drizzle/schema";
import { desc, eq, inArray } from "drizzle-orm";

export const getResourceVersion = new Hono<{
  Bindings: CloudflareBindings;
}>().get("/:resourceLocator/versions", async (c) => {
  const { resource, db } = await resourceLookup(
    c.req.param("resourceLocator"),
    c.env,
  );

  if (!resource.ok) {
    return c.json(
      {
        message: "Failed lookup",
      },
      500,
    );
  }

  if (!resource.data) {
    return c.json(
      {
        message: "Not Found",
      },
      404,
    );
  }

  const versions = await db
    .select()
    .from(versionsTable)
    .where(eq(versionsTable.resourceId, resource.data.id)).orderBy(desc(versionsTable.createdAt));

  const versionItemIds = versions.map((item) => item.id);
  const artifacts = await db
    .select()
    .from(artifactsTable)
    .where(inArray(artifactsTable.versionId, versionItemIds));

  console.log(artifacts);

  //group
  const artifactsByVersion = Map.groupBy(artifacts, (k) => k.versionId);
  const response = versions.map((item) => {
    return {
      ...item,
      artifacts: artifactsByVersion.get(item.id) ?? [],
    };
  });

  return c.json(response);
});
