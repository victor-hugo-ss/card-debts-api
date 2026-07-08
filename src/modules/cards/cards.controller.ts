import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createCreditCardBodySchema,
  type CreateCreditCardBody,
} from "./cards.schema.js";

import { creditCardsService } from "./cards.service.js";

export const creditCardsController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createCreditCardBodySchema.parse(
      request.body,
    ) as CreateCreditCardBody;

    const creditCard = await creditCardsService.create({
      ...body,
      ownerId: request.user.sub,
    });

    return reply.status(201).send(creditCard);
  },

  async list(request: FastifyRequest, reply: FastifyReply) {
    const creditCards = await creditCardsService.list(request.user.sub);

    return reply.send(creditCards);
  },
};
