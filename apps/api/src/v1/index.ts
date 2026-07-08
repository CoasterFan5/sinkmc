import { Hono } from "hono";
import { authApp } from "./auth";
import { user } from "./session/user";

export const v1 = new Hono<{ Bindings: CloudflareBindings }>()
  .route("/auth", authApp)
  .route("/", user);
