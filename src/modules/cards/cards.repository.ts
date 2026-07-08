import { prisma } from "../../shared/database/prisma-client.js";
import type { CreateCreditCardBody } from "./cards.schema.js";

type CreateCreditCardData = CreateCreditCardBody & {
  ownerId: string;
};

export const creditCardsRepository = {
  create(data: CreateCreditCardData) {
    return prisma.creditCard.create({
      data,
    });
  },
};
