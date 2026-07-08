import { installmentsRepository } from "./installments.repository.js";
import type { ListInstallmentsQuery } from "./installments.schema.js";
import { AppError } from "../../shared/errors/app.error.js";

export const installmentsService = {
  async list(ownerId: string, filters: ListInstallmentsQuery) {
    const [installments, total] =
      await installmentsRepository.findManyByOwnerId(ownerId, filters);

    return {
      data: installments,
      meta: {
        page: filters.page,
        perPage: filters.perPage,
        total,
        totalPages: Math.ceil(total / filters.perPage),
      },
    };
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

  async unpay(id: string, ownerId: string) {
    const installment = await installmentsRepository.findByIdAndOwnerId(
      id,
      ownerId,
    );

    if (!installment) {
      throw new AppError("Parcela não encontrada", 404);
    }

    if (installment.status === "PENDING") {
      throw new AppError("Parcela ainda não foi paga", 409);
    }

    return installmentsRepository.markAsPending(id);
  },
};
