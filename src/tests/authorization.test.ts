import type { FastifyInstance } from "fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildApp } from "../app.js";
import { env } from "../shared/config/env.js";
import { prisma } from "../shared/database/prisma-client.js";

let app: FastifyInstance;
let adminToken: string;
let friendToken: string;

describe("Authorization", () => {
  beforeAll(async () => {
    app = await buildApp();
    await app.ready();

    const adminLoginResponse = await request(app.server)
      .post("/sessions")
      .send({
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
      });

    adminToken = adminLoginResponse.body.token;

    const friendEmail = `friend-${Date.now()}@email.com`;
    const friendPassword = "123456";

    const createFriendResponse = await request(app.server)
      .post("/admin/friends")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Friend Teste",
        email: friendEmail,
        password: friendPassword,
      });

    const friendLoginResponse = await request(app.server)
      .post("/sessions")
      .send({
        email: createFriendResponse.body.email,
        password: friendPassword,
      });

    friendToken = friendLoginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "friend-",
        },
      },
    });

    await app.close();
  });

  it("não deve permitir friend listar amigos", async () => {
    const response = await request(app.server)
      .get("/users/friends")
      .set("Authorization", `Bearer ${friendToken}`);

    expect(response.statusCode).toBe(403);
  });

  it("não deve permitir admin acessar resumo do friend", async () => {
    const response = await request(app.server)
      .get("/friend/summary")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(403);
  });

  it("deve permitir admin listar amigos", async () => {
    const response = await request(app.server)
      .get("/users/friends")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve permitir friend acessar seu resumo", async () => {
    const response = await request(app.server)
      .get("/friend/summary")
      .set("Authorization", `Bearer ${friendToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      totalDebt: expect.any(String),
      pendingDebt: expect.any(String),
      paidDebt: expect.any(String),
      pendingInstallments: expect.any(Number),
      paidInstallments: expect.any(Number),
    });
  });
});
