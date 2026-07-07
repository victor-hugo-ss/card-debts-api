import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
});

export const healthSchema = {
  tags: ["Health"],
  summary: "Verifica se a API está online",
  response: {
    200: healthResponseSchema,
  },
};
