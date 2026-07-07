import { z } from "zod";

export const createUserBodySchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
