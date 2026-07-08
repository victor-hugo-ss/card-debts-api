import { z } from "zod";

import { bearerAuthSecurity } from "../../shared/docs/security.js";

export const dashboardSummaryResponseSchema = z.object({
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
