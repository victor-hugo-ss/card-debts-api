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

export const listInstallmentsQuerySchema = z.object({
  status: z.enum(["PENDING", "PAID"]).optional(),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Informe o mês no formato YYYY-MM")
    .optional(),
  friendId: z.string().uuid("Informe um amigo válido").optional(),
  creditCardId: z.string().uuid("Informe um cartão válido").optional(),
});

export const listInstallmentsSchema = {
  tags: ["Installments"],
  summary: "Lista as parcelas cadastradas",
  ...bearerAuthSecurity,
  querystring: listInstallmentsQuerySchema,
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

export const unpayInstallmentSchema = {
  tags: ["Installments"],
  summary: "Desfaz o pagamento de uma parcela",
  ...bearerAuthSecurity,
  params: installmentParamsSchema,
  response: {
    200: installmentResponseSchema,
  },
};

export type ListInstallmentsQuery = z.infer<typeof listInstallmentsQuerySchema>;
export type InstallmentParams = z.infer<typeof installmentParamsSchema>;
