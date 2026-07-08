import { z } from "zod";

import { bearerAuthSecurity } from "../../shared/docs/security.js";

export const createCreditCardBodySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  brand: z.string().optional(),
  lastDigits: z
    .string()
    .length(4, "Informe exatamente os 4 últimos dígitos")
    .optional(),
  limit: z.coerce
    .number()
    .positive("O limite deve ser maior que zero")
    .optional(),
  closingDay: z
    .number()
    .int("O dia de fechamento precisa ser um número inteiro")
    .min(1, "O dia de fechamento deve ser entre 1 e 31")
    .max(31, "O dia de fechamento deve ser entre 1 e 31"),
  dueDay: z
    .number()
    .int("O dia de fechamento precisa ser um número inteiro")
    .min(1, "O dia de fechamento deve ser entre 1 e 31")
    .max(31, "O dia de fechamento deve ser entre 1 e 31"),
});

export const creditCardResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  brand: z.string().nullable(),
  lastDigits: z.string().nullable(),
  limit: z.any().nullable(),
  closingDay: z.number(),
  dueDay: z.number(),
  ownerId: z.string().uuid(),
  createdAt: z.date(),
});

export const createCreditCardSchema = {
  tags: ["Credit Cards"],
  summary: "Cadastra um cartão de crédito",
  ...bearerAuthSecurity,
  body: createCreditCardBodySchema,
  response: {
    201: creditCardResponseSchema,
  },
};

export const listCreditCardsSchema = {
  tags: ["Credit Cards"],
  summary: "Lista os cartões de crédito",
  ...bearerAuthSecurity,
  response: {
    200: z.array(creditCardResponseSchema),
  },
};

export type CreateCreditCardBody = z.infer<typeof createCreditCardBodySchema>;
