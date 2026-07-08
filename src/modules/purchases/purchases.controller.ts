import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createPurchaseBodySchema,
  purchaseParamsSchema,
  type CreatePurchaseBody,
  type PurchaseParams,
} from "./purchases.schema.js";
import { purchasesService } from "./purchases.service.js";

export const purchasesController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createPurchaseBodySchema.parse(
      request.body,
    ) as CreatePurchaseBody;

    const purchase = await purchasesService.create({
      ...body,
      ownerId: request.user.sub,
    });

    return reply.status(201).send(purchase);
  },

  async list(request: FastifyRequest, reply: FastifyReply) {
    const purchases = await purchasesService.list(request.user.sub);

    return reply.send(purchases);
  },

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = purchaseParamsSchema.parse(request.params) as PurchaseParams;

    const purchase = await purchasesService.getById(id, request.user.sub);

    return reply.send(purchase);
  },
};
