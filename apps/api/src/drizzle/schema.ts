import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const usersTable = sqliteTable("users", {
  id: text().notNull().unique().$defaultFn(createId),
  userName: text().notNull(),
  email: text().notNull().unique(),
  pfpUrl: text().notNull(),
});

export const loginsTable = sqliteTable("logins", {
  id: text().notNull().unique().$defaultFn(createId),
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
  id: text().notNull().unique(),
  userId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  type: text({
    enum: ["WEB_SESSION", "API_KEY"],
  }),
  name: text(),
  scopes: text({ mode: "json" }).$type<string[]>().notNull(),

  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
});
