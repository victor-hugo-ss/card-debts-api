import { AppError } from "../../shared/errors/app.error.js";
import { debtsRepository } from "./debts.repository.js";

export const debtsService = {
  async listByFriend(friendId: string, ownerId: string) {
    const friend = await debtsRepository.findFriendById(friendId);

    if (!friend) {
      throw new AppError("Amigo não encontrado", 404);
    }

    const installments =
      await debtsRepository.findPendingInstallmentsByFriendId(
        friendId,
        ownerId,
      );

    const totalPending = installments.reduce((total, installment) => {
      return total + Number(installment.amount);
    }, 0);

    return {
      friend,
      totalPending,
      installments,
    };
  },
};
