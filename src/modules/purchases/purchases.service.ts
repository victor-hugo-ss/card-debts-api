import { AppError } from "../../shared/errors/app.error.js";
import type { CreatePurchaseBody } from "./purchases.schema.js";
import { purchasesRepository } from "./purchases.repository.js";

type CreatePurchaseServiceData = CreatePurchaseBody & {
  ownerId: string;
};

function addMonths(date: Date, months: number) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);

  return newDate;
}

function generateInstallments(
  amount: number,
  installmentsCount: number,
  purchaseDate: Date,
  closingDay: number,
  dueDay: number,
) {
  const installmentAmount = amount / installmentsCount;

  const firstDueDate = new Date(purchaseDate);
  firstDueDate.setDate(dueDay);

  const purchaseDay = purchaseDate.getDate();

  if (purchaseDay > closingDay || firstDueDate <= purchaseDate) {
    firstDueDate.setMonth(firstDueDate.getMonth() + 1);
  }

  return Array.from({ length: installmentsCount }).map((_, index) => ({
    number: index + 1,
    amount: installmentAmount,
    dueDate: addMonths(firstDueDate, index),
  }));
}

export const purchasesService = {
  async create(data: CreatePurchaseServiceData) {
    const friend = await purchasesRepository.findFriendById(data.friendId);

    if (!friend) {
      throw new AppError("Amigo não encontrado", 404);
    }

    const creditCard = await purchasesRepository.findCreditCardByIdAndOwnerId(
      data.creditCardId,
      data.ownerId,
    );

    if (!creditCard) {
      throw new AppError("Cartão de crédito não encontrado", 404);
    }

    const installments = generateInstallments(
      data.amount,
      data.installmentsCount,
      data.purchaseDate,
      creditCard.closingDay,
      creditCard.dueDay,
    );

    return purchasesRepository.create({
      ...data,
      installments,
    });
  },

  async list(ownerId: string) {
    return purchasesRepository.findManyByOwnerId(ownerId);
  },
};
