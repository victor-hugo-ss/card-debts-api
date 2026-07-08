import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { roleMiddleware } from "../../shared/middlewares/role.middleware.js";
import { dashboardController } from "./dashboard.controller.js";
import { getDashboardSummarySchema } from "./dashboard.schema.js";

export async function dashboardRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    "/dashboard",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: getDashboardSummarySchema,
    },
    dashboardController.summary,
  );
}
