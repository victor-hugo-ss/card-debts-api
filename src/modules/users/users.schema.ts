import { z } from "zod";

import { bearerAuthSecurity } from "../../shared/docs/security.js";

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

export const friendResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
});

export const createFriendByAdminBodySchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const createFriendByAdminResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.literal("FRIEND"),
  createdAt: z.date(),
});

export const createFriendByAdminSchema = {
  tags: ["Users"],
  summary: "Cadastra um amigo",
  ...bearerAuthSecurity,
  body: createFriendByAdminBodySchema,
  response: {
    201: createFriendByAdminResponseSchema,
  },
};

export const listFriendsSchema = {
  tags: ["Users"],
  summary: "Lista os amigos cadastrados",
  ...bearerAuthSecurity,
  response: {
    200: z.array(friendResponseSchema),
  },
};

export const createUserSchema = {
  tags: ["Users"],
  summary: "Cria um novo usuário",
  body: createUserBodySchema,
  response: {
    201: userResponseSchema,
  },
};

export const getProfileSchema = {
  tags: ["Users"],
  summary: "Retorna o usuário autenticado",
  ...bearerAuthSecurity,
  response: {
    200: userResponseSchema,
  },
};

export type CreateFriendByAdminInput = z.infer<
  typeof createFriendByAdminBodySchema
>;
export type CreateUserBody = z.infer<typeof createUserBodySchema>;
