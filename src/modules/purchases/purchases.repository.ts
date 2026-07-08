import { prisma } from "../../shared/database/prisma-client.js";
import type { CreatePurchaseBody } from "./purchases.schema.js";

type InstallmentData = {
  number: number;
  amount: number;
  dueDate: Date;
};

type CreatePurchaseData = CreatePurchaseBody & {
  ownerId: string;
  installments: InstallmentData[];
};

export const purchasesRepository = {
  findFriendById(friendId: string) {
    return prisma.user.findFirst({
      where: {
        id: friendId,
        role: "FRIEND",
      },
    });
  },

  findCreditCardByIdAndOwnerId(creditCardId: string, ownerId: string) {
    return prisma.creditCard.findFirst({
      where: {
        id: creditCardId,
        ownerId,
      },
    });
  },

  create(data: CreatePurchaseData) {
    return prisma.purchase.create({
      data: {
        description: data.description,
        amount: data.amount,
        purchaseDate: data.purchaseDate,
        installmentsCount: data.installmentsCount,
        ownerId: data.ownerId,
        friendId: data.friendId,
        creditCardId: data.creditCardId,
        installments: {
          create: data.installments,
        },
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creditCard: {
          select: {
            id: true,
            name: true,
            brand: true,
            lastDigits: true,
          },
        },
        installments: true,
      },
    });
  },

  findManyByOwnerId(ownerId: string) {
    return prisma.purchase.findMany({
      where: {
        ownerId,
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creditCard: {
          select: {
            id: true,
            name: true,
            brand: true,
            lastDigits: true,
          },
        },
        installments: {
          orderBy: {
            number: "asc",
          },
        },
      },
      orderBy: {
        purchaseDate: "desc",
      },
    });
  },

  findByIdAndOwnerId(id: string, ownerId: string) {
    return prisma.purchase.findFirst({
      where: {
        id,
        ownerId,
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creditCard: {
          select: {
            id: true,
            name: true,
            brand: true,
            lastDigits: true,
          },
        },
        installments: {
          orderBy: {
            number: "asc",
          },
        },
      },
    });
  },
};
