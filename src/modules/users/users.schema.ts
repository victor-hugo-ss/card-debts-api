import { z } from "zod";

export const createUserBodySchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["ADMIN", "FRIEND"]),
  createdAt: z.date(),
});

export const createUserSchema = {
  tags: ["Users"],
  summary: "Cria um novo usuário",
  body: createUserBodySchema,
  response: {
    201: userResponseSchema,
  },
};

export const getProfileResponseSchema = z.object({
  sub: z.string().uuid(),
  role: z.enum(["ADMIN", "FRIEND"]),
});

export const getProfileSchema = {
  tags: ["Users"],
  summary: "Retorna o usuário autenticado",
  response: {
    200: getProfileResponseSchema,
  },
};
export type CreateUserBody = z.infer<typeof createUserBodySchema>;
