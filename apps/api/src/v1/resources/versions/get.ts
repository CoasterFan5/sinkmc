import { Hono } from "hono";
import { resourceLookup } from "../../../utils/resourceLookup";
import { versionsTable } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";

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
    .where(eq(versionsTable.resourceId, resource.data.id));

  return c.json(versions);
});
