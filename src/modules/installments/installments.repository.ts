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
