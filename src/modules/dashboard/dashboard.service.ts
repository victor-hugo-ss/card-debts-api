import { dashboardRepository } from "./dashboard.repository.js";

export const dashboardService = {
  async getSummary(ownerId: string) {
    const installments =
      await dashboardRepository.findInstallmentsByOwnerId(ownerId);

    return installments.reduce(
      (summary, installment) => {
        const amount = Number(installment.amount);

        summary.totalPurchases += amount;

        if (installment.status === "PENDING") {
          summary.totalPending += amount;
          summary.pendingInstallments += 1;
        }

        if (installment.status === "PAID") {
          summary.totalPaid += amount;
          summary.paidInstallments += 1;
        }

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

  async getByFriend(ownerId: string) {
    const installments =
      await dashboardRepository.findInstallmentsWithFriendByOwnerId(ownerId);

    const byFriend: Array<{
      friendId: string;
      friendName: string;
      totalPending: number;
      totalPaid: number;
      totalPurchases: number;
      pendingInstallments: number;
      paidInstallments: number;
    }> = [];

    for (const installment of installments) {
      const amount = Number(installment.amount);
      const friend = installment.purchase.friend;

      let friendSummary = byFriend.find((item) => item.friendId === friend.id);

      if (!friendSummary) {
        friendSummary = {
          friendId: friend.id,
          friendName: friend.name,
          totalPending: 0,
          totalPaid: 0,
          totalPurchases: 0,
          pendingInstallments: 0,
          paidInstallments: 0,
        };

        byFriend.push(friendSummary);
      }

      friendSummary.totalPurchases += amount;

      if (installment.status === "PENDING") {
        friendSummary.totalPending += amount;
        friendSummary.pendingInstallments += 1;
      }

      if (installment.status === "PAID") {
        friendSummary.totalPaid += amount;
        friendSummary.paidInstallments += 1;
      }
    }

    return byFriend;
  },

  async getByCreditCard(ownerId: string) {
    const installments =
      await dashboardRepository.findInstallmentsWithCreditCardByOwnerId(
        ownerId,
      );

    const byCreditCard: Array<{
      creditCardId: string;
      creditCardName: string;
      creditCardBrand: string | null;
      creditCardLastDigits: string | null;
      totalPending: number;
      totalPaid: number;
      totalPurchases: number;
      pendingInstallments: number;
      paidInstallments: number;
    }> = [];

    for (const installment of installments) {
      const amount = Number(installment.amount);
      const creditCard = installment.purchase.creditCard;

      let creditCardSummary = byCreditCard.find(
        (item) => item.creditCardId === creditCard.id,
      );

      if (!creditCardSummary) {
        creditCardSummary = {
          creditCardId: creditCard.id,
          creditCardName: creditCard.name,
          creditCardBrand: creditCard.brand,
          creditCardLastDigits: creditCard.lastDigits,
          totalPending: 0,
          totalPaid: 0,
          totalPurchases: 0,
          pendingInstallments: 0,
          paidInstallments: 0,
        };

        byCreditCard.push(creditCardSummary);
      }

      creditCardSummary.totalPurchases += amount;

      if (installment.status === "PENDING") {
        creditCardSummary.totalPending += amount;
        creditCardSummary.pendingInstallments += 1;
      }

      if (installment.status === "PAID") {
        creditCardSummary.totalPaid += amount;
        creditCardSummary.paidInstallments += 1;
      }
    }

    return byCreditCard;
  },
};
