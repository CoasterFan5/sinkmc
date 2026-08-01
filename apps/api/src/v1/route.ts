import { authRoute } from "./auth/route";
import { sessionRoute } from "./session/route";
import { OpenAPIHono } from "@hono/zod-openapi";
import { resourcesRoute } from "./resources/route";


export const v1 = new OpenAPIHono<{ Bindings: CloudflareBindings }>()
  .route("/session", sessionRoute)
  .route("/auth", authRoute)
  .route("/resources", resourcesRoute)
