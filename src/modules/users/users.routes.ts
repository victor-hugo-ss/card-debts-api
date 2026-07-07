import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { usersController } from "./users.controller.js";
import { createUserSchema, getProfileSchema } from "./users.schema.js";

export async function usersRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    "/users",
    {
      schema: createUserSchema,
    },
    usersController.create,
  );

  typedApp.get(
    "/me",
    {
      preHandler: [authMiddleware],
      schema: getProfileSchema,
    },
    usersController.me,
  );
}
