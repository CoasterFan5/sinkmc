import crypto from "crypto";
import { getDb } from "../drizzle/db";
import { tokens } from "../drizzle/schema";

const DAYS_90 = 90 * 24 * 60 * 60 * 1000;

export const createSession = async (
  userId: string,
  bindings: CloudflareBindings,
) => {
  const token = `sink_${crypto.randomBytes(32).toString("hex")}`;

  const tokenHash = crypto.hash("sha512", token);

  const db = getDb(bindings);
  try {
    const t = await db
      .insert(tokens)
      .values({
        tokenHash: tokenHash,
        userId: userId,
        type: "WEB_SESSION",
        name: "User Session Token",
        scopes: ["*"],
        expiresAt: new Date(Date.now() + DAYS_90),
      })
      .returning();

    if (!t[0]) {
      return false;
    }

    return {
      token,
      tokenHash,
    };
  } catch (e) {
    console.error(e);
    return false;
  }
};
