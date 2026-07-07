import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { authController } from "./auth.controller.js";
import { loginSchema } from "./auth.schema.js";

export async function authRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    "/sessions",
    {
      schema: loginSchema,
    },
    authController.login,
  );
}
