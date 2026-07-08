import { prisma } from "../../shared/database/prisma-client.js";
import type { Prisma } from "../../generated/prisma/client.js";
import type {
  CreatePurchaseBody,
  ListPurchasesQuery,
} from "./purchases.schema.js";

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

  findManyByOwnerId(ownerId: string, filters: ListPurchasesQuery) {
    const where: Prisma.PurchaseWhereInput = {
      ownerId,
      friendId: filters.friendId,
      creditCardId: filters.creditCardId,
    };

    if (filters.month) {
      const [year, month] = filters.month.split("-").map(Number);

      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 1));

      where.purchaseDate = {
        gte: startDate,
        lt: endDate,
      };
    }

    return prisma.purchase.findMany({
      where,
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
