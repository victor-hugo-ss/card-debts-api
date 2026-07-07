import type { FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "../errors/app.error.js";

export async function authMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
  } catch {
    throw new AppError("Token inválido ou ausente", 401);
  }
}
