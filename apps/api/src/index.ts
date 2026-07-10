import { Hono } from "hono";
import { v1 } from "./v1";
import { trimTrailingSlash } from "hono/trailing-slash";

const app = new Hono<{ Bindings: CloudflareBindings }>();

const routes = app
  .use(
    trimTrailingSlash({
      alwaysRedirect: true,
    }),
  )
  .route("/v1/", v1)
  .get("/status", (c) => {
    return c.json({
      message: "Looks good to me!",
    });
  });

export default app;
export type AppType = typeof routes;
