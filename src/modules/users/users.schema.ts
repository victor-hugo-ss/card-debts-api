import { z } from "zod";

export const createUserBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
