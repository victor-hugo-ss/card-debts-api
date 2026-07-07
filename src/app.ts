import Fastify from "fastify";

import { healthRoutes } from "./modules/health/health.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import {
  setupSwagger,
  setupSwaggerUi,
  setupZodValidator,
} from "./shared/config/swagger.js";
import { errorHandler } from "./shared/middlewares/error.handler.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  setupZodValidator(app);

  await setupSwagger(app);

  app.setErrorHandler(errorHandler);

  app.register(healthRoutes);
  app.register(usersRoutes);

  await setupSwaggerUi(app);

  return app;
}
