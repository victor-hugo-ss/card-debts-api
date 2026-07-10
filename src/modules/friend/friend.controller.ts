import type { FastifyReply, FastifyRequest } from "fastify";

import {
  friendMonthlySummaryQuerySchema,
  listFriendInstallmentsQuerySchema,
  type FriendMonthlySummaryQuery,
  type ListFriendInstallmentsQuery,
} from "./friend.schema.js";
import { friendService } from "./friend.service.js";

export const friendController = {
  async listPurchases(request: FastifyRequest, reply: FastifyReply) {
    const purchases = await friendService.listPurchases(request.user.sub);

    return reply.send(purchases);
  },

  async listInstallments(request: FastifyRequest, reply: FastifyReply) {
    const filters = listFriendInstallmentsQuerySchema.parse(
      request.query,
    ) as ListFriendInstallmentsQuery;

    const installments = await friendService.listInstallments(
      request.user.sub,
      filters,
    );

    return reply.send(installments);
  },

  async getSummary(request: FastifyRequest, reply: FastifyReply) {
    const summary = await friendService.getSummary(request.user.sub);

    return reply.send(summary);
  },

  async getMonthlySummary(request: FastifyRequest, reply: FastifyReply) {
    const filters = friendMonthlySummaryQuerySchema.parse(
      request.query,
    ) as FriendMonthlySummaryQuery;

    const summary = await friendService.getMonthlySummary(
      request.user.sub,
      filters,
    );

    return reply.send(summary);
  },
};
