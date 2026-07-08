import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { roleMiddleware } from "../../shared/middlewares/role.middleware.js";
import { creditCardsController } from "./cards.controller.js";
import {
  createCreditCardSchema,
  getCreditCardSchema,
  listCreditCardsSchema,
  updateCreditCardSchema,
} from "./cards.schema.js";

export async function creditCardsRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    "/credit-cards",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: createCreditCardSchema,
    },
    creditCardsController.create,
  );

  typedApp.get(
    "/credit-cards",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: listCreditCardsSchema,
    },
    creditCardsController.list,
  );

  typedApp.get(
    "/credit-cards/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: getCreditCardSchema,
    },
    creditCardsController.getById,
  );

  typedApp.put(
    "/credit-cards/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: updateCreditCardSchema,
    },
    creditCardsController.update,
  );
}
