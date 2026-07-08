import { z } from "zod";

import { bearerAuthSecurity } from "../../shared/docs/security.js";

export const installmentPurchaseResponseSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  purchaseDate: z.date(),
  friend: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
  }),
  creditCard: z.object({
    id: z.string().uuid(),
    name: z.string(),
    brand: z.string().nullable(),
    lastDigits: z.string().nullable(),
  }),
});

export const installmentResponseSchema = z.object({
  id: z.string().uuid(),
  number: z.number(),
  amount: z.any(),
  dueDate: z.date(),
  status: z.enum(["PENDING", "PAID"]),
  paidAt: z.date().nullable(),
  purchase: installmentPurchaseResponseSchema,
});

export const listInstallmentsSchema = {
  tags: ["Installments"],
  summary: "Lista as parcelas cadastradas",
  ...bearerAuthSecurity,
  response: {
    200: z.array(installmentResponseSchema),
  },
};

export const installmentParamsSchema = z.object({
  id: z.string().uuid("Informe uma parcela válida"),
});

export const payInstallmentSchema = {
  tags: ["Installments"],
  summary: "Marca uma parcela como paga",
  ...bearerAuthSecurity,
  params: installmentParamsSchema,
  response: {
    200: installmentResponseSchema,
  },
};

export type InstallmentParams = z.infer<typeof installmentParamsSchema>;
