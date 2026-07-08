import type { FastifyReply, FastifyRequest } from "fastify";

import { dashboardService } from "./dashboard.service.js";

export const dashboardController = {
  async summary(request: FastifyRequest, reply: FastifyReply) {
    const summary = await dashboardService.getSummary(request.user.sub);

    return reply.send(summary);
  },

  async byFriend(request: FastifyRequest, reply: FastifyReply) {
    const summary = await dashboardService.getByFriend(request.user.sub);

    return reply.send(summary);
  },

  async byCreditCard(request: FastifyRequest, reply: FastifyReply) {
    const summary = await dashboardService.getByCreditCard(request.user.sub);

    return reply.send(summary);
  },

  async upcomingInstallments(request: FastifyRequest, reply: FastifyReply) {
    const installments = await dashboardService.getUpcomingInstallments(
      request.user.sub,
    );

    return reply.send(installments);
  },

  async byMonth(request: FastifyRequest, reply: FastifyReply) {
    const summary = await dashboardService.getByMonth(request.user.sub);

    return reply.send(summary);
  },
};
