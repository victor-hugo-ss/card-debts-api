import Fastify from "fastify";

import { healthRoutes } from "./modules/health/health.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { errorHandler } from "./shared/middlewares/error.handler.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.setErrorHandler(errorHandler);

  app.register(healthRoutes);
  app.register(usersRoutes);

  return app;
}
