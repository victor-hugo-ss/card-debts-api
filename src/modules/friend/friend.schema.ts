import { z } from "zod";

import { bearerAuthSecurity } from "../../shared/docs/security.js";

const decimalSchema = z.union([z.string(), z.number(), z.any()]);

export const listFriendInstallmentsQuerySchema = z.object({
  status: z.enum(["PENDING", "PAID"]).optional(),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Informe o mês no formato YYYY-MM")
    .optional(),
});

export type ListFriendInstallmentsQuery = z.infer<
  typeof listFriendInstallmentsQuerySchema
>;

export const friendPurchaseResponseSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  amount: z.any(),
  purchaseDate: z.date(),
  installmentsCount: z.number(),
  createdAt: z.date(),
  creditCard: z.object({
    id: z.string().uuid(),
    name: z.string(),
    brand: z.string().nullable(),
    lastDigits: z.string().nullable(),
  }),
  installments: z.array(
    z.object({
      id: z.string().uuid(),
      number: z.number(),
      amount: z.any(),
      dueDate: z.date(),
      status: z.enum(["PENDING", "PAID"]),
      paidAt: z.date().nullable(),
    }),
  ),
});

export const friendInstallmentResponseSchema = z.object({
  id: z.string().uuid(),
  number: z.number(),
  amount: z.any(),
  dueDate: z.date(),
  status: z.enum(["PENDING", "PAID"]),
  paidAt: z.date().nullable(),
  purchase: z.object({
    id: z.string().uuid(),
    description: z.string(),
    purchaseDate: z.date(),
    creditCard: z.object({
      id: z.string().uuid(),
      name: z.string(),
      brand: z.string().nullable(),
      lastDigits: z.string().nullable(),
    }),
  }),
});

export const friendSummaryResponseSchema = z.object({
  totalDebt: z.string(),
  pendingDebt: z.string(),
  paidDebt: z.string(),
  pendingInstallments: z.number(),
  paidInstallments: z.number(),
});

export const listFriendPurchasesSchema = {
  tags: ["Friend"],
  summary: "Lista as compras do amigo logado",
  ...bearerAuthSecurity,
  response: {
    200: z.array(friendPurchaseResponseSchema),
  },
};

export const listFriendInstallmentsSchema = {
  tags: ["Friend"],
  summary: "Lista as parcelas do amigo logado",
  ...bearerAuthSecurity,
  querystring: listFriendInstallmentsQuerySchema,
  response: {
    200: z.array(friendInstallmentResponseSchema),
  },
};

export const friendSummarySchema = {
  tags: ["Friend"],
  summary: "Exibe o resumo de dívidas do amigo logado",
  ...bearerAuthSecurity,
  response: {
    200: friendSummaryResponseSchema,
  },
};
