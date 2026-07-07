import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { usersController } from "./users.controller.js";
import { createUserSchema } from "./users.schema.js";

export async function usersRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    "/users",
    {
      schema: createUserSchema,
    },
    usersController.create,
  );
}
