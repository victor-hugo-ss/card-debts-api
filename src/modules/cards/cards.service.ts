import { AppError } from "../../shared/errors/app.error.js";

import type {
  CreateCreditCardBody,
  UpdateCreditCardBody,
} from "./cards.schema.js";

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

  async getById(id: string, ownerId: string) {
    const creditCard = await creditCardsRepository.findByIdAndOwnerId(
      id,
      ownerId,
    );

    if (!creditCard) {
      throw new AppError("Cartão de crédito não encontrado", 404);
    }

    return creditCard;
  },

  async update(id: string, ownerId: string, data: UpdateCreditCardBody) {
    await this.getById(id, ownerId);

    return creditCardsRepository.update(id, data);
  },

  async delete(id: string, ownerId: string) {
    await this.getById(id, ownerId);

    await creditCardsRepository.delete(id);
  },
};
