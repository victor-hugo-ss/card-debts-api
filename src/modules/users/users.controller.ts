import type { FastifyReply, FastifyRequest } from "fastify";

import { createUserBodySchema } from "./users.schema.js";
import { usersService } from "./users.service.js";

export const usersController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createUserBodySchema.parse(request.body);

    const user = await usersService.create(body);

    return reply.status(201).send(user);
  },
};
