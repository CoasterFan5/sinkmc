import { createMiddleware } from "hono/factory";
import crypto from "crypto";
import { safeDbQuery } from "./safeDbQuery";
import { getDb } from "../drizzle/db";
import { tokens, usersTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { JwtTokenIssuedAt } from "hono/utils/jwt/types";

export type TokenWithoutHash = Omit<typeof tokens.$inferSelect, "tokenHash">;

export const auth = createMiddleware<{
  Bindings: CloudflareBindings;
  Variables: {
    tokenData: TokenWithoutHash;
    user: typeof usersTable.$inferSelect;
  };
}>(async (c, next) => {
  const t = c.req.header("Authorization");
  console.log(t);
  const token = t?.split(" ")[1];

  if (!token) {
    return c.json(
      {
        message: "No token specified",
      },
      401,
    );
  }

  const hash = crypto.hash("sha512", token);

  // pull from db
  const db = getDb(c.env);
  const tokenData = await safeDbQuery(
    db
      .select({
        name: tokens.name,
        id: tokens.id,
        userId: tokens.userId,
        type: tokens.type,
        scopes: tokens.scopes,
        createdAt: tokens.createdAt,
        expiresAt: tokens.expiresAt,
      })
      .from(tokens)
      .where(eq(tokens.tokenHash, hash)).get,
  );

  if (!tokenData.ok) {
    return c.json(
      {
        message: "Error pulling token data",
      },
      500,
    );
  }

  if (!tokenData.data) {
    return c.json(
      {
        message: "Invalid Token",
      },
      401,
    );
  }

  const userData = await safeDbQuery(
    db.select().from(usersTable).where(eq(usersTable.id, tokenData.data.userId))
      .get,
  );
  if (!userData.ok) {
    return c.json(
      {
        message: "Error pulling token data",
      },
      500,
    );
  }

  if (!userData.data) {
    return c.json(
      {
        message: "Invalid Token User Reference",
      },
      401,
    );
  }

  c.set("user", userData.data);
  c.set("tokenData", tokenData.data);
  await next();
});
