import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { roleMiddleware } from "../../shared/middlewares/role.middleware.js";
import { debtsController } from "./debts.controller.js";
import { listFriendDebtsSchema } from "./debts.schema.js";

export async function debtsRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    "/friends/:friendId/debts",
    {
      preHandler: [authMiddleware, roleMiddleware(["ADMIN"])],
      schema: listFriendDebtsSchema,
    },
    debtsController.listByFriend,
  );
}
