import type { ListFriendInstallmentsQuery } from "./friend.schema.js";
import { friendRepository } from "./friend.repository.js";

export const friendService = {
  async listPurchases(friendId: string) {
    return friendRepository.findPurchasesByFriendId(friendId);
  },

  async listInstallments(
    friendId: string,
    filters: ListFriendInstallmentsQuery,
  ) {
    return friendRepository.findInstallmentsByFriendId(friendId, filters);
  },

  async getSummary(friendId: string) {
    const installments =
      await friendRepository.findInstallmentsByFriendId(friendId);

    const totalDebt = installments.reduce(
      (total, installment) => total + Number(installment.amount),
      0,
    );

    const pendingDebt = installments.reduce((total, installment) => {
      if (installment.status === "PENDING") {
        return total + Number(installment.amount);
      }

      return total;
    }, 0);

    const paidDebt = installments.reduce((total, installment) => {
      if (installment.status === "PAID") {
        return total + Number(installment.amount);
      }

      return total;
    }, 0);

    const pendingInstallments = installments.filter(
      (installment) => installment.status === "PENDING",
    ).length;

    const paidInstallments = installments.filter(
      (installment) => installment.status === "PAID",
    ).length;

    return {
      totalDebt: totalDebt.toString(),
      pendingDebt: pendingDebt.toString(),
      paidDebt: paidDebt.toString(),
      pendingInstallments,
      paidInstallments,
    };
  },
};
