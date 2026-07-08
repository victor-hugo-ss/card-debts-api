import { z } from "zod";

import { bearerAuthSecurity } from "../../shared/docs/security.js";

export const createPurchaseBodySchema = z.object({
  description: z
    .string()
    .min(2, "A descrição deve ter pelo menos 2 caracteres"),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  purchaseDate: z.coerce.date(),
  installmentsCount: z.coerce.number().int().min(1).max(24),
  friendId: z.string().uuid("Informe um amigo válido"),
  creditCardId: z.string().uuid("Informe um cartão válido"),
});

export const installmentResponseSchema = z.object({
  id: z.string().uuid(),
  number: z.number(),
  amount: z.any(),
  dueDate: z.date(),
  status: z.enum(["PENDING", "PAID"]),
  paidAt: z.date().nullable(),
});

export const purchaseFriendResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export const purchaseCreditCardResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  brand: z.string().nullable(),
  lastDigits: z.string().nullable(),
});

export const purchaseResponseSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  amount: z.any(),
  purchaseDate: z.date(),
  installmentsCount: z.number(),
  ownerId: z.string().uuid(),
  friendId: z.string().uuid(),
  creditCardId: z.string().uuid(),
  createdAt: z.date(),
  friend: purchaseFriendResponseSchema,
  creditCard: purchaseCreditCardResponseSchema,
  installments: z.array(installmentResponseSchema),
});

export const createPurchaseSchema = {
  tags: ["Purchases"],
  summary: "Cadastra uma compra e gera suas parcelas",
  ...bearerAuthSecurity,
  body: createPurchaseBodySchema,
  response: {
    201: purchaseResponseSchema,
  },
};

export const listPurchasesSchema = {
  tags: ["Purchases"],
  summary: "Lista as compras cadastradas",
  ...bearerAuthSecurity,
  response: {
    200: z.array(purchaseResponseSchema),
  },
};

export type CreatePurchaseBody = z.infer<typeof createPurchaseBodySchema>;
