export const scopes = ["*", "resources:write", "versions:write"] as const;
export type Scope = (typeof scopes)[number];

export const checkScopes = (reqScopes: Scope[], requiredScope: Scope) => {
  for (const checkScope of reqScopes) {
    if (checkScope == "*" || checkScope == requiredScope) {
      return true;
    }
  }

  return false;
};
