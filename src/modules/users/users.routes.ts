import type { FastifyInstance } from "fastify";

import { usersController } from "./users.controller.js";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", usersController.create);
}
