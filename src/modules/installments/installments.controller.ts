import type { FastifyReply, FastifyRequest } from "fastify";

import { installmentsService } from "./installments.service.js";

export const installmentsController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const installments = await installmentsService.list(request.user.sub);

    return reply.send(installments);
  },
};
