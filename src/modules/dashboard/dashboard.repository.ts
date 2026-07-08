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
};
