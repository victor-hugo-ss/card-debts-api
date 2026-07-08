import { dashboardRepository } from "./dashboard.repository.js";

export const dashboardService = {
  async getSummary(ownerId: string) {
    const installments =
      await dashboardRepository.findInstallmentsByOwnerId(ownerId);

    return installments.reduce(
      (summary, installment) => {
        const amount = Number(installment.amount);

        if (installment.status === "PENDING") {
          summary.totalPending += amount;
          summary.pendingInstallments += 1;
        }

        if (installment.status === "PAID") {
          summary.totalPaid += amount;
          summary.paidInstallments += 1;
        }

        summary.totalPurchases += amount;

        return summary;
      },
      {
        totalPending: 0,
        totalPaid: 0,
        totalPurchases: 0,
        pendingInstallments: 0,
        paidInstallments: 0,
      },
    );
  },
};
