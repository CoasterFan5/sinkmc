import { and, eq, type SQL } from "drizzle-orm";
import { resourcesTable } from "../drizzle/schema";
import { getDb } from "../drizzle/db";
import { safeDbQuery } from "./safeDbQuery";

export const resourceLookup = async (
  locator: string,
  env: CloudflareBindings,
) => {
  const isIdLook = locator.includes("_");

  const filters: SQL[] = [];
  if (isIdLook) {
    filters.push(eq(resourcesTable.id, locator));
  } else {
    filters.push(eq(resourcesTable.slug, locator));
  }
  const db = getDb(env);
  const item = await safeDbQuery(
    db
      .select()
      .from(resourcesTable)
      .where(and(...filters)).get,
  );

  return {
    resource: item,
    db: db,
  };
};
