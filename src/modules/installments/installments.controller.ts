import type { FastifyReply, FastifyRequest } from "fastify";

import { installmentsService } from "./installments.service.js";
import {
  installmentParamsSchema,
  type InstallmentParams,
} from "./installments.schema.js";

export const installmentsController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const installments = await installmentsService.list(request.user.sub);

    return reply.send(installments);
  },

  async pay(request: FastifyRequest, reply: FastifyReply) {
    const { id } = installmentParamsSchema.parse(
      request.params,
    ) as InstallmentParams;

    const installment = await installmentsService.pay(id, request.user.sub);

    return reply.send(installment);
  },
};
