import { z } from "zod";

import { bearerAuthSecurity } from "../../shared/docs/security.js";

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

export const friendParamsSchema = z.object({
  id: z.string().uuid("Informe um ID válido"),
});

export const createFriendByAdminBodySchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const updateFriendBodySchema = z
  .object({
    name: z.string().min(1, "Informe o nome").optional(),
    email: z.string().email("Informe um e-mail válido").optional(),
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .optional(),
  })
  .refine((data) => data.name || data.email || data.password, {
    message: "Informe ao menos um campo para atualizar",
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

export const updateFriendSchema = {
  tags: ["Users"],
  summary: "Atualiza um amigo",
  ...bearerAuthSecurity,
  params: friendParamsSchema,
  body: updateFriendBodySchema,
  response: {
    200: friendResponseSchema,
  },
};

export const deleteFriendSchema = {
  tags: ["Users"],
  summary: "Desativa um amigo",
  ...bearerAuthSecurity,
  params: friendParamsSchema,
  response: {
    204: z.null(),
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
export type UpdateFriendInput = z.infer<typeof updateFriendBodySchema>;
export type FriendParams = z.infer<typeof friendParamsSchema>;

