import type { FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "../errors/app.error.js";

type Role = "ADMIN" | "FRIEND";

export function roleMiddleware(allowedRoles: Role[]) {
  return async function (request: FastifyRequest, _reply: FastifyReply) {
    if (!allowedRoles.includes(request.user.role)) {
      throw new AppError("Acesso não autorizado", 403);
    }
  };
}
