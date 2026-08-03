import { Hono } from "hono";
import { resourceDownloads } from "./download/download";

// this is the resources/:location route

export const resourcesRouter = new Hono<{ Bindings: CloudflareBindings }>()
  .route("/", resourceDownloads)
