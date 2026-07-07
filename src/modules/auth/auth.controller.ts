import type { FastifyReply, FastifyRequest } from "fastify";

import { authService } from "./auth.service.js";
import { loginBodySchema } from "./auth.schema.js";

export const authController = {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = loginBodySchema.parse(request.body);

    const user = await authService.login(body);

    const token = await reply.jwtSign({
      sub: user.id,
      role: user.role,
    });

    return reply.send({
      token,
    });
  },
};
