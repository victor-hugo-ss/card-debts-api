import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { roleMiddleware } from "../../shared/middlewares/role.middleware.js";
import { installmentsController } from "./installments.controller.js";
import {
  listInstallmentsSchema,
  payInstallmentSchema,
  unpayInstallmentSchema,
} from "./installments.schema.js";

export async function installmentsRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    "/installments",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: listInstallmentsSchema,
    },
    installmentsController.list,
  );

  typedApp.patch(
    "/installments/:id/pay",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: payInstallmentSchema,
    },
    installmentsController.pay,
  );

  typedApp.patch(
    "/installments/:id/unpay",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: unpayInstallmentSchema,
    },
    installmentsController.unpay,
  );
}
