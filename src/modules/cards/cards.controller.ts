import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createCreditCardBodySchema,
  creditCardParamsSchema,
  updateCreditCardBodySchema,
  type CreateCreditCardBody,
  type CreditCardParams,
  type UpdateCreditCardBody,
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

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = creditCardParamsSchema.parse(
      request.params,
    ) as CreditCardParams;

    const creditCard = await creditCardsService.getById(id, request.user.sub);

    return reply.send(creditCard);
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = creditCardParamsSchema.parse(
      request.params,
    ) as CreditCardParams;
    const body = updateCreditCardBodySchema.parse(
      request.body,
    ) as UpdateCreditCardBody;

    const creditCard = await creditCardsService.update(
      id,
      request.user.sub,
      body,
    );

    return reply.send(creditCard);
  },
};
