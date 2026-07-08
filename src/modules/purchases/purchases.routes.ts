import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { roleMiddleware } from "../../shared/middlewares/role.middleware.js";
import { purchasesController } from "./purchases.controller.js";
import { createPurchaseSchema } from "./purchases.schema.js";

export async function purchasesRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    "/purchases",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: createPurchaseSchema,
    },
    purchasesController.create,
  );
}
