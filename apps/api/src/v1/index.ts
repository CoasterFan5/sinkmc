import { Hono } from "hono";
import { authApp } from "./auth";
import { user } from "./session/user";
import { resourcesRouter } from "./resources";
import { singleResourceRouter } from "./resources/getResource";

export const v1 = new Hono<{ Bindings: CloudflareBindings }>()
  .route("/auth", authApp)
  .route("/session", user)
  .route("/resources", resourcesRouter)
  .route("/resource", singleResourceRouter);
