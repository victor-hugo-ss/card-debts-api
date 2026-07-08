import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { roleMiddleware } from "../../shared/middlewares/role.middleware.js";
import { dashboardController } from "./dashboard.controller.js";
import {
  getDashboardByCreditCardSchema,
  getDashboardByFriendSchema,
  getDashboardSummarySchema,
  getDashboardUpcomingInstallmentsSchema,
} from "./dashboard.schema.js";

export async function dashboardRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    "/dashboard/summary",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: getDashboardSummarySchema,
    },
    dashboardController.summary,
  );

  typedApp.get(
    "/dashboard/by-friend",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: getDashboardByFriendSchema,
    },
    dashboardController.byFriend,
  );

  typedApp.get(
    "/dashboard/by-credit-card",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: getDashboardByCreditCardSchema,
    },
    dashboardController.byCreditCard,
  );

  typedApp.get(
    "/dashboard/upcoming-installments",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: getDashboardUpcomingInstallmentsSchema,
    },
    dashboardController.upcomingInstallments,
  );
}
