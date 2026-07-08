import { prisma } from "../../shared/database/prisma-client.js";

export const dashboardRepository = {
  findInstallmentsByOwnerId(ownerId: string) {
    return prisma.installment.findMany({
      where: {
        purchase: {
          ownerId,
        },
      },
      select: {
        amount: true,
        status: true,
      },
    });
  },

  findInstallmentsWithFriendByOwnerId(ownerId: string) {
    return prisma.installment.findMany({
      where: {
        purchase: {
          ownerId,
        },
      },
      select: {
        amount: true,
        status: true,
        purchase: {
          select: {
            friend: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },

  findInstallmentsWithCreditCardByOwnerId(ownerId: string) {
    return prisma.installment.findMany({
      where: {
        purchase: {
          ownerId,
        },
      },
      select: {
        amount: true,
        status: true,
        purchase: {
          select: {
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
