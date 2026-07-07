import { buildApp } from "./app.js";

const app = buildApp();

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP server running on http://localhost:3333");
  });
