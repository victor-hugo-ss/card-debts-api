import { prisma } from "../../shared/database/prisma-client.js";

export const installmentsRepository = {
  findManyByOwnerId(ownerId: string) {
    return prisma.installment.findMany({
      where: {
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
      orderBy: {
        dueDate: "asc",
      },
    });
  },
};
