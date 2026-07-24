import { writeFileSync } from "node:fs";
import app from "./src";

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "SinkMC Api",
  },
});

const response = await app.request("/doc");
const spec = await response.json();

writeFileSync("./openapi.json", JSON.stringify(spec, null, 2));
console.log("✓ OpenAPI spec written to openapi.json");
