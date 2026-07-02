import { zValidator } from "@hono/zod-validator";
import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { z } from "zod/mini";
import { getDb } from "../../drizzle/db";
import { loginsTable, usersTable } from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";
import { createSession } from "../../utils/createSession";

const githubUserZodSchema = z.object({
  login: z.string(),
  id: z.int(),
  avatar_url: z.string(),
});

type GithubEmailsList = {
  email: string;
  primary: boolean;
  verified: boolean;
}[];

export const authApp = new Hono<{ Bindings: CloudflareBindings }>().post(
  "github",
  zValidator(
    "json",
    z.object({
      code: z.string(),
    }),
  ),
  async (c) => {
    const { code } = c.req.valid("json");

    const fetchUrl = new URL("https://github.com/login/oauth/access_token");
    fetchUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    fetchUrl.searchParams.set("client_secret", env.GITHUB_CLIENT_SECRET);
    fetchUrl.searchParams.set("code", code);

    const ghReq = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
    const respBody = (await ghReq.json()) as Record<string, string>;
    const accessToken = respBody.access_token;

    if (!accessToken) {
      return c.json(
        {
          code: "BAD_TOKEN",
          message: "Invalid Token",
        },
        400,
      );
    }

    const userReq = fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "User-Agent": "SinkMC",
      },
    });

    const emailReq = fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "User-Agent": "SinkMC",
      },
    });

    const userReqAwaited = await userReq;
    const emailReqAwaited = await emailReq;

    if (userReqAwaited.status == 401 || emailReqAwaited.status == 401) {
      return c.json(
        {
          code: "EXPIRED_CREDENTIALS",
          message: "OAuth credentials expired.",
        },
        401,
      );
    }

    const userJson = await userReqAwaited.json();
    const emailJson = (await emailReqAwaited.json()) as GithubEmailsList;

    let primaryVerifiedEmail = undefined;

    for (const eMailItem of emailJson) {
      if (eMailItem.verified && eMailItem.primary) {
        primaryVerifiedEmail = eMailItem.email;
      }
    }

    if (!primaryVerifiedEmail) {
      return c.json(
        {
          code: "NO_VERIFIED_EMAIL",
          message: "No verified primary email",
        },
        401,
      );
    }

    const u = githubUserZodSchema.safeParse(userJson);

    if (u.error) {
      return c.json(
        {
          code: "INTERNAL_ERROR",
          message: "Could not verify user",
        },
        500,
      );
    }

    // check for an existing login
    const db = getDb(c.env);
    const loginCheck = await db
      .select()
      .from(loginsTable)
      .where(
        and(
          eq(loginsTable.provider, "GITHUB"),
          eq(loginsTable.externalId, u.data.id.toString()),
        ),
      )
      .get();

    if (loginCheck) {
      const newSession = await createSession(loginCheck.userId, c.env);
      if (!newSession) {
        return c.json(
          {
            code: "INTERNAL_ERROR",
            message: "Failed to issue token",
          },
          500,
        );
      }

      return c.json(
        {
          token: newSession.token,
          tokenHash: newSession.tokenHash,
        },
        200,
      );
    }

    // check if a user exists
    const userCheck = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, primaryVerifiedEmail))
      .get();

    if (userCheck != undefined) {
      return c.json(
        {
          code: "EXISTING_ACCOUNT",
          message: "An account with this email already exists",
        },
        500,
      );
    }

    try {
      const nu = await db
        .insert(usersTable)
        .values({
          email: primaryVerifiedEmail,
          userName: u.data.login,
          pfpUrl: u.data.avatar_url,
        })
        .returning();

      const id = nu[0].id;
      if (!id) {
        return c.json(
          {
            code: "INTERNAL_ERROR",
            message: "Issue creating account.",
          },
          500,
        );
      }

      await db.insert(loginsTable).values({
        userId: id,
        provider: "GITHUB",
        externalId: u.data.id.toString(),
      });

      if (nu == undefined) {
        return c.json(
          {
            code: "INTERNAL_ERROR",
            message: "Issue creating login",
          },
          500,
        );
      }
      const newSession = await createSession(nu[0].id, c.env);
      if (!newSession) {
        return c.json(
          {
            code: "INTERNAL_ERROR",
            message: "Failed to issue token",
          },
          500,
        );
      }

      return c.json(
        {
          token: newSession.token,
          tokenHash: newSession.tokenHash,
        },
        200,
      );
    } catch (e) {
      return c.json(
        {
          code: "INTERNAL_ERROR",
          message: "Issue creating login and session",
        },
        500,
      );
    }
  },
);
