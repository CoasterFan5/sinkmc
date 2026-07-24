import { OpenAPIHono } from "@hono/zod-openapi";
import { status } from "./status";
import { v1 } from "./v1";
import { trimTrailingSlash } from "hono/trailing-slash";


const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();


app.use(trimTrailingSlash({
  alwaysRedirect: true
}))

// register routes
app.route("/v1/", v1)
app.route("/", status)

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "SinkMC Api",
  },
});


export default app;
