import type { FastifyInstance } from "fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildApp } from "../app.js";
import { env } from "../shared/config/env.js";

let app: FastifyInstance;

describe("Auth", () => {
  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("deve autenticar o admin", async () => {
    const response = await request(app.server).post("/sessions").send({
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
