import { fullApp } from "./app";

fullApp.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "SinkMC Api",
  },
});

export default fullApp;
