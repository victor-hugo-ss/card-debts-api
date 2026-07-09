import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { env } from "./shared/config/env.js";

import { healthRoutes } from "./modules/health/health.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { creditCardsRoutes } from "./modules/cards/cards.routes.js";
import { purchasesRoutes } from "./modules/purchases/purchases.routes.js";
import { debtsRoutes } from "./modules/debts/debts.routes.js";
import { installmentsRoutes } from "./modules/installments/installments.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { friendRoutes } from "./modules/friend/friend.routes.js";

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

  await app.register(fastifyCors, {
    origin: env.FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  });

  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  setupZodValidator(app);

  await setupSwagger(app);

  app.setErrorHandler(errorHandler);

  app.register(healthRoutes);
  app.register(usersRoutes);
  app.register(authRoutes);
  app.register(creditCardsRoutes);
  app.register(purchasesRoutes);
  app.register(debtsRoutes);
  app.register(installmentsRoutes);
  app.register(dashboardRoutes);
  app.register(friendRoutes);

  await setupSwaggerUi(app);

  return app;
}
