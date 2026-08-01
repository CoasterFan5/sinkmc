import { createMiddleware } from "hono/factory";
import crypto from "crypto";
import { safeDbQuery } from "./safeDbQuery";
import { getDb } from "../drizzle/db";
import { tokens, usersTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { Scope } from "./scopes";
import { createRoute, z } from "@hono/zod-openapi";

type OpenApiResponse = Parameters<typeof createRoute>['0']['responses']
type ResponseType = OpenApiResponse[string]

const possibleErrors = [401, 500] as const
type PossibleError = (typeof possibleErrors)[number]
// This is a little more strict.
type ErrorResponses = Record<PossibleError, ResponseType>

const zod_401 = z.object({
  message: z.enum(["No token specified", "Invalid Token", "Invalid Token User Reference", "Missing required scopes"])
});
type ERROR_401 = z.infer<typeof zod_401>
const zod_500 = z.object({
  message: z.enum(["Error pulling token data"]),
})
type ERROR_500 = z.infer<typeof zod_500>

const openApiResponses: OpenApiResponse = {
  "401": {
    content: {
      "application/json": {
        schema: zod_401
      }
    },
    description: "You are not authorized for this route for some reason"
  },
  "500": {
    content: {
      "application/json": {
        schema: zod_500
      }
    },
    description: "An internal error occurred."
  }
}

export type TokenWithoutHash = Omit<typeof tokens.$inferSelect, "tokenHash">;

export const createAuthMiddleware = <T extends Scope[]>(scopes: T) => {
  return {
    middleware: createAuthFunction(scopes), // the actual function,
    securityObject: {
      auth: scopes
    }, // used when defining route schemas
    openApiResponses: openApiResponses as unknown as ErrorResponses,
  }
}

export const createAuthFunction = (scopes: Scope[]) => {
  return createMiddleware<{
    Bindings: CloudflareBindings;
    Variables: {
      tokenData: TokenWithoutHash;
      user: typeof usersTable.$inferSelect;
    };
  }>(async (c, next) => {
    const token = c.req.header("Authorization")?.split(' ')[1];

    if (!token) {
      return c.json(
        {
          message: "No token specified",
        } as ERROR_401,
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
        } as ERROR_401,
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
        } as ERROR_500,
        500,
      );
    }

    if (!userData.data) {
      return c.json(
        {
          message: "Invalid Token User Reference",
        } as ERROR_401,
        401,
      );
    }

    // and then just check the scopes real quick
    if (!tokenData.data.scopes.includes("*")) {
      for (const scope of scopes) {
        if (!tokenData.data.scopes.includes(scope)) {
          return c.json({
            message: "Missing required scopes"
          } as ERROR_401, 401)
        }
      }
    }


    c.set("user", userData.data);
    c.set("tokenData", tokenData.data);
    await next();
  });
}
