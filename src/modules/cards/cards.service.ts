import type { CreateCreditCardBody } from "./cards.schema.js";
import { creditCardsRepository } from "./cards.repository.js";

type CreateCreditCardServiceData = CreateCreditCardBody & {
  ownerId: string;
};

export const creditCardsService = {
  async create(data: CreateCreditCardServiceData) {
    return creditCardsRepository.create(data);
  },

  async list(ownerId: string) {
    return creditCardsRepository.findManyByOwnerId(ownerId);
  },
};
