import { Hono } from "hono";

export const versions = new Hono<{
  Bindings: CloudflareBindings;
}>().get("/version");
