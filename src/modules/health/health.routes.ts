import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { healthController } from "./health.controller.js";
import { healthSchema } from "./health.schema.js";

export async function healthRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    "/health",
    {
      schema: healthSchema,
    },
    healthController,
  );
}
