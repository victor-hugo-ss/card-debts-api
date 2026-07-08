import { prisma } from "../../shared/database/prisma-client.js";

export const debtsRepository = {
  findFriendById(friendId: string) {
    return prisma.user.findFirst({
      where: {
        id: friendId,
        role: "FRIEND",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  },

  findPendingInstallmentsByFriendId(friendId: string, ownerId: string) {
    return prisma.installment.findMany({
      where: {
        status: "PENDING",
        purchase: {
          friendId,
          ownerId,
        },
      },
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
