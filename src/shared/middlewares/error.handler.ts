import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import { AppError } from "../errors/app.error.js";

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Erro de validação",
      issues: error.flatten().fieldErrors,
    });
  }

  return reply.status(500).send({
    message: "Erro interno do servidor",
  });
}
