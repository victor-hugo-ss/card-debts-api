import { buildApp } from "./app.js";
import { env } from "./shared/config/env.js";

const app = await buildApp();

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${env.PORT}`);
  });
