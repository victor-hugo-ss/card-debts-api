import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../shared/database/prisma-client.js";

export const installmentsRepository = {
  findManyByOwnerId(
    ownerId: string,
    filters: {
      status?: "PENDING" | "PAID";
      month?: string;
      friendId?: string;
      creditCardId?: string;
    },
  ) {
    const where: Prisma.InstallmentWhereInput = {
      purchase: {
        ownerId,
        friendId: filters.friendId,
        creditCardId: filters.creditCardId,
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
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });
  },

  findByIdAndOwnerId(id: string, ownerId: string) {
    return prisma.installment.findFirst({
      where: {
        id,
        purchase: {
          ownerId,
        },
      },
      include: {
        purchase: {
          select: {
            id: true,
            description: true,
            purchaseDate: true,
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
          },
        },
      },
    });
  },

  markAsPaid(id: string) {
    return prisma.installment.update({
      where: {
        id,
      },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
      include: {
        purchase: {
          select: {
            id: true,
            description: true,
            purchaseDate: true,
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
          },
        },
      },
    });
  },

  markAsPending(id: string) {
    return prisma.installment.update({
      where: {
        id,
      },
      data: {
        status: "PENDING",
        paidAt: null,
      },
      include: {
        purchase: {
          select: {
            id: true,
            description: true,
            purchaseDate: true,
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
          },
        },
      },
    });
  },
};
