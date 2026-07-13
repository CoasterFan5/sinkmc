import { Context } from "hono";
import { TokenWithoutHash } from "./authMiddleware";

export const scopes = ["*", "resources:write"] as const;
export type Scope = (typeof scopes)[number];

export const checkScopes = (reqScopes: Scope[], requiredScope: Scope) => {
  for (const checkScope in reqScopes) {
    if (checkScope == "*" || checkScope == requiredScope) {
      return true;
    }
  }

  return false;
};
