import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createPurchaseBodySchema,
  type CreatePurchaseBody,
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
};
