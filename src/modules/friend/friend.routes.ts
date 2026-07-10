import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { roleMiddleware } from "../../shared/middlewares/role.middleware.js";
import { friendController } from "./friend.controller.js";
import {
  friendMonthlySummarySchema,
  friendSummarySchema,
  listFriendInstallmentsSchema,
  listFriendPurchasesSchema,
} from "./friend.schema.js";

export const friendRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook("preHandler", authMiddleware);
  app.addHook("preHandler", roleMiddleware(["FRIEND"]));

  app.get(
    "/friend/purchases",
    {
      schema: listFriendPurchasesSchema,
    },
    friendController.listPurchases,
  );

  app.get(
    "/friend/installments",
    {
      schema: listFriendInstallmentsSchema,
    },
    friendController.listInstallments,
  );

  app.get(
    "/friend/summary",
    {
      schema: friendSummarySchema,
    },
    friendController.getSummary,
  );

  app.get(
    "/friend/monthly-summary",
    {
      schema: friendMonthlySummarySchema,
    },
    friendController.getMonthlySummary,
  );
};
