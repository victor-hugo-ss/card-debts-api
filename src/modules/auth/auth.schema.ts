import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe a senha"),
});

export const loginResponseSchema = z.object({
  token: z.string(),
});

export const loginSchema = {
  tags: ["Auth"],
  summary: "Realiza login do usuário",
  body: loginBodySchema,
  response: {
    200: loginResponseSchema,
  },
};

export type LoginBody = z.infer<typeof loginBodySchema>;
