import { z } from "zod";

import { bearerAuthSecurity } from "../../shared/docs/security.js";

export const friendDebtsParamsSchema = z.object({
  friendId: z.string().uuid("Informe um amigo válido"),
});

export const debtInstallmentResponseSchema = z.object({
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

export const listFriendDebtsResponseSchema = z.object({
  friend: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
  }),
  totalPending: z.any(),
  installments: z.array(debtInstallmentResponseSchema),
});

export const listFriendDebtsSchema = {
  tags: ["Debts"],
  summary: "Lista as dívidas pendentes de um amigo",
  ...bearerAuthSecurity,
  params: friendDebtsParamsSchema,
  response: {
    200: listFriendDebtsResponseSchema,
  },
};

export type FriendDebtsParams = z.infer<typeof friendDebtsParamsSchema>;
