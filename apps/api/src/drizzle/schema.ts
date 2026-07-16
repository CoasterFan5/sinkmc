import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { Scope } from "../utils/scopes";
import { categories, platforms } from "@repo/taxonomy";

const createSinkId = (prefix: string) => {
  return () => {
    return `${prefix}_${createId}`;
  };
};

export const usersTable = sqliteTable("users", {
  id: text().notNull().unique().$defaultFn(createSinkId("usr")),
  userName: text().notNull(),
  email: text().notNull().unique(),
  pfpUrl: text().notNull(),
});

export const loginsTable = sqliteTable("logins", {
  id: text().notNull().unique().$defaultFn(createSinkId("lgn")),
  userId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  provider: text({
    enum: ["GITHUB"],
  }).notNull(),
  externalId: text().notNull(),
});

export const tokens = sqliteTable("tokens", {
  id: text().notNull().unique().$defaultFn(createSinkId("tkn_id")),
  tokenHash: text().notNull().unique(),
  userId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  type: text({
    enum: ["WEB_SESSION", "API_KEY"],
  }),
  name: text(),
  scopes: text({ mode: "json" }).$type<Scope[]>().notNull(),

  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
});

export const resourcesTable = sqliteTable("resources", {
  id: text().primaryKey().$defaultFn(createSinkId("res")),
  ownerId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  category: text({
    enum: categories,
  }).notNull(),
  price: integer().notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const versionsTable = sqliteTable("version", {
  id: text().primaryKey().$defaultFn(createSinkId("ver")),
  ownerId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  resourceId: text()
    .notNull()
    .references(() => resourcesTable.id, {
      onDelete: "cascade",
    }),
  versionString: text().notNull(),
  description: text().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const artifactsTable = sqliteTable("artifact", {
  id: text().primaryKey().$defaultFn(createSinkId("artifact")),
  versionId: text()
    .notNull()
    .references(() => versionsTable.id, {
      onDelete: "cascade",
    }),
  resourceId: text()
    .notNull()
    .references(() => resourcesTable.id, {
      onDelete: "cascade",
    }),
  supportedVersions: text({ mode: "json" }).$type<string[]>().notNull(),
  platforms: text({
    mode: "json",
  })
    .$type<typeof platforms>()
    .notNull(),
  hash: text().notNull(),
  fileKey: text().notNull(),
});
