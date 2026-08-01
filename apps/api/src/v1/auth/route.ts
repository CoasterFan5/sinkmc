import { OpenAPIHono } from "@hono/zod-openapi";
import { githubRoute } from "./github/route";


export const authRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>()
  .route("/github", githubRoute)
