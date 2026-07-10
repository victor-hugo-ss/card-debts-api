import { prisma } from "../../shared/database/prisma-client.js";
import type {
  CreateCreditCardBody,
  UpdateCreditCardBody,
} from "./cards.schema.js";

type CreateCreditCardData = CreateCreditCardBody & {
  ownerId: string;
};

export const creditCardsRepository = {
  create(data: CreateCreditCardData) {
    return prisma.creditCard.create({
      data,
    });
  },

  findManyByOwnerId(ownerId: string) {
    return prisma.creditCard.findMany({
      where: {
        ownerId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findByIdAndOwnerId(id: string, ownerId: string) {
    return prisma.creditCard.findFirst({
      where: {
        id,
        ownerId,
        isActive: true,
      },
    });
  },

  update(id: string, data: UpdateCreditCardBody) {
    return prisma.creditCard.update({
      where: {
        id,
      },
      data,
    });
  },

  deactivate(id: string) {
    return prisma.creditCard.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  },
};
