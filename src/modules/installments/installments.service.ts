import { installmentsRepository } from "./installments.repository.js";
import { AppError } from "../../shared/errors/app.error.js";

export const installmentsService = {
  async list(ownerId: string) {
    return installmentsRepository.findManyByOwnerId(ownerId);
  },

  async pay(id: string, ownerId: string) {
    const installment = await installmentsRepository.findByIdAndOwnerId(
      id,
      ownerId,
    );

    if (!installment) {
      throw new AppError("Parcela não encontrada", 404);
    }

    if (installment.status === "PAID") {
      throw new AppError("Parcela já está paga", 409);
    }

    return installmentsRepository.markAsPaid(id);
  },
};
