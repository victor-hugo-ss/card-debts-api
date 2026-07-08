import { z } from "zod";

import { bearerAuthSecurity } from "../../shared/docs/security.js";

export const dashboardSummaryResponseSchema = z.object({
  totalPending: z.number(),
  totalPaid: z.number(),
  totalPurchases: z.number(),
  pendingInstallments: z.number(),
  paidInstallments: z.number(),
});

export const dashboardByFriendResponseSchema = z.object({
  friendId: z.string().uuid(),
  friendName: z.string(),
  totalPending: z.number(),
  totalPaid: z.number(),
  totalPurchases: z.number(),
  pendingInstallments: z.number(),
  paidInstallments: z.number(),
});

export const dashboardByCreditCardResponseSchema = z.object({
  creditCardId: z.string().uuid(),
  creditCardName: z.string(),
  creditCardBrand: z.string().nullable(),
  creditCardLastDigits: z.string().nullable(),
  totalPending: z.number(),
  totalPaid: z.number(),
  totalPurchases: z.number(),
  pendingInstallments: z.number(),
  paidInstallments: z.number(),
});

export const getDashboardSummarySchema = {
  tags: ["Dashboard"],
  summary: "Retorna o resumo geral do dashboard",
  ...bearerAuthSecurity,
  response: {
    200: dashboardSummaryResponseSchema,
  },
};

export const getDashboardByFriendSchema = {
  tags: ["Dashboard"],
  summary: "Retorna o resumo do dashboard por amigo",
  ...bearerAuthSecurity,
  response: {
    200: z.array(dashboardByFriendResponseSchema),
  },
};

export const getDashboardByCreditCardSchema = {
  tags: ["Dashboard"],
  summary: "Retorna o resumo do dashboard por cartão",
  ...bearerAuthSecurity,
  response: {
    200: z.array(dashboardByCreditCardResponseSchema),
  },
};
