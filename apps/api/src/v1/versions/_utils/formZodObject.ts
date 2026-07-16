/**
 * Defines the zod object for the from data endpoint to accept artifacts
 */

import { zValidator } from "@hono/zod-validator";
import { taxonomy } from "@repo/taxonomy";
import z from "zod";

export const versionsZodValidator = zValidator(
  "form",
  z.object({
    resourceId: z.string(),
    description: z.string(),
    artifacts: z.string().transform((val, ctx) => {
      try {
        const parsedArtifacts = z
          .array(
            z.object({
              supportedVersions: z.array(z.string()),
              platforms: z.array(z.enum(taxonomy.platforms)),
              fileKey: z.string(),
            }),
          )
          .safeParse(JSON.parse(val));

        if (!parsedArtifacts.success) {
          ctx.addIssue({
            code: "custom",
            message: parsedArtifacts.error.issues
              .map((i) => i.message)
              .join(", "),
          });
          return z.NEVER;
        }
        return parsedArtifacts.data;
      } catch {
        ctx.addIssue({
          code: "custom",
          message: "Failed to parse artifacts json string",
        });
        return z.NEVER;
      }
    }),
  }),
);
