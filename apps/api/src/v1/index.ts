import { Hono } from "hono";
import { authApp } from "./auth";

export const v1 = new Hono<{ Bindings: CloudflareBindings }>().route(
  "/auth",
  authApp,
);
