import { authRoute } from "./auth/route";
import { resourcesRouter } from "./resources";
import { versions } from "./versions/versions";
import { sessionRoute } from "./session/route";
import { OpenAPIHono } from "@hono/zod-openapi";


export const v1 = new OpenAPIHono<{ Bindings: CloudflareBindings }>()
  .route("/session", sessionRoute).route("/auth", authRoute)
