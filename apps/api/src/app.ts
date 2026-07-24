import { v1 } from "./v1";
import { trimTrailingSlash } from "hono/trailing-slash";
import { app } from "./utils/honoApp";
import "./status";

const routes = app
  .use(
    trimTrailingSlash({
      alwaysRedirect: true,
    }),
  )
  .route("/v1/", v1)

export const fullApp = app;

export type AppType = typeof routes;
