import { Hono } from "hono";
import { newResourceRouter } from "./create";
import { getDb } from "../../drizzle/db";
import { resourcesTable } from "../../drizzle/schema";
import { and, eq, getTableColumns, SQL } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { singleResourceRouter } from "./singleResource";
import { getResourceVersion } from "./versions/get";
import { resourceDownloads } from "./download/download";

// this is the resources/:location route

export const resourcesRouter = new Hono<{ Bindings: CloudflareBindings }>()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        slug: z.string().optional(),
        id: z.string().optional(),
        ownerId: z.string().optional(),
      }),
    ),
    async (c) => {

    },
  )
  .route("/", getResourceVersion)
  .route("/", resourceDownloads)
  .route("/", singleResourceRouter)
  .route("/", newResourceRouter);
