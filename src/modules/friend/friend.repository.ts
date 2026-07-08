import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../shared/database/prisma-client.js";
import type { ListFriendInstallmentsQuery } from "./friend.schema.js";

export const friendRepository = {
  findPurchasesByFriendId(friendId: string) {
    return prisma.purchase.findMany({
      where: {
        friendId,
      },
      include: {
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

  findInstallmentsByFriendId(
    friendId: string,
    filters: ListFriendInstallmentsQuery = {},
  ) {
    const where: Prisma.InstallmentWhereInput = {
      purchase: {
        friendId,
      },
      status: filters.status,
    };

    if (filters.month) {
      const [year, month] = filters.month.split("-").map(Number);

      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 1));

      where.dueDate = {
        gte: startDate,
        lt: endDate,
      };
    }

    return prisma.installment.findMany({
      where,
      include: {
        purchase: {
          select: {
            id: true,
            description: true,
            purchaseDate: true,
            creditCard: {
              select: {
                id: true,
                name: true,
                brand: true,
                lastDigits: true,
              },
            },
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });
  },
};
