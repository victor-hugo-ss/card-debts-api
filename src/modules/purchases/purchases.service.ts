import { AppError } from "../../shared/errors/app.error.js";
import type {
  CreatePurchaseBody,
  ListPurchasesQuery,
} from "./purchases.schema.js";
import { purchasesRepository } from "./purchases.repository.js";

type CreatePurchaseServiceData = CreatePurchaseBody & {
  ownerId: string;
};

function getLastDayOfMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function createUTCDate(year: number, month: number, day: number) {
  const lastDayOfMonth = getLastDayOfMonth(year, month);
  const safeDay = Math.min(day, lastDayOfMonth);

  return new Date(Date.UTC(year, month, safeDay));
}

function addMonths(date: Date, months: number) {
  return createUTCDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + months,
    date.getUTCDate(),
  );
}

function calculateFirstDueDate(
  purchaseDate: Date,
  closingDay: number,
  dueDay: number,
) {
  const purchaseYear = purchaseDate.getUTCFullYear();
  const purchaseMonth = purchaseDate.getUTCMonth();
  const purchaseDay = purchaseDate.getUTCDate();

  const closingMonthOffset = purchaseDay <= closingDay ? 0 : 1;

  const closingDate = createUTCDate(
    purchaseYear,
    purchaseMonth + closingMonthOffset,
    closingDay,
  );

  const dueMonthOffset = dueDay <= closingDay ? 1 : 0;

  return createUTCDate(
    closingDate.getUTCFullYear(),
    closingDate.getUTCMonth() + dueMonthOffset,
    dueDay,
  );
}

function generateInstallments(
  amount: number,
  installmentsCount: number,
  purchaseDate: Date,
  closingDay: number,
  dueDay: number,
) {
  const installmentAmount = amount / installmentsCount;

  const firstDueDate = calculateFirstDueDate(purchaseDate, closingDay, dueDay);

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

  async list(ownerId: string, filters: ListPurchasesQuery) {
    const [purchases, total] = await purchasesRepository.findManyByOwnerId(
      ownerId,
      filters,
    );

    return {
      data: purchases,
      meta: {
        page: filters.page,
        perPage: filters.perPage,
        total,
        totalPages: Math.ceil(total / filters.perPage),
      },
    };
  },

  async getById(id: string, ownerId: string) {
    const purchase = await purchasesRepository.findByIdAndOwnerId(id, ownerId);

    if (!purchase) {
      throw new AppError("Compra não encontrada", 404);
    }

    return purchase;
  },
};
