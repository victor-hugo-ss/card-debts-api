import { installmentsRepository } from "./installments.repository.js";

export const installmentsService = {
  async list(ownerId: string) {
    return installmentsRepository.findManyByOwnerId(ownerId);
  },
};
