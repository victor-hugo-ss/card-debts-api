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

  it("não deve autenticar com senha inválida", async () => {
    const response = await request(app.server).post("/sessions").send({
      email: env.ADMIN_EMAIL,
      password: "senha-incorreta",
    });

    expect(response.statusCode).toBe(401);
  });

  it("não deve retornar usuário sem token", async () => {
    const response = await request(app.server).get("/me");

    expect(response.statusCode).toBe(401);
  });

  it("deve retornar o usuário autenticado", async () => {
    const loginResponse = await request(app.server).post("/sessions").send({
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
    });

    const token = loginResponse.body.token;

    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      email: env.ADMIN_EMAIL,
      role: "ADMIN",
      createdAt: expect.any(String),
    });
  });
});
