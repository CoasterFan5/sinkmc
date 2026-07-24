# Route system
Keeping this organized is hard for me. 
Routes are seperated as if to use file-based routing, but they are not. 
At the root of each directory is an `route.ts` that exports a route which sub-routes are registered under.
For instance, /v1/session is declared in `./v1/session/route.ts` whereas if there was a sub-route of session that just returned session scopes, call it `api.sinkmc.org/v1/session/scopes` it would be declared in `./v1/session/scopes/route.ts`.


## OpenAPI Schmeas
Declare an openapi schema inside of a `schema.ts` file. This makes it simple to identify the schema of a route while also seperating the schema from the code behind it. All OpenAPI schemas for routes should be exported with _schema suffic. For instance, getSession -> getSession_schema.

## Middleware
Adding auth to a route is very simple, simply add the `auth` middleware to the **OpenAPI schema**. Do this for idnvidual routes for the sake of explicitness instead of to entire groups of routes to prevent requiring auth on a route that should be public.
