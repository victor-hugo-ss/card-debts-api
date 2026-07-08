import type { FastifyInstance } from "fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildApp } from "../app.js";
import { env } from "../shared/config/env.js";
import { prisma } from "../shared/database/prisma-client.js";

let app: FastifyInstance;
let adminToken: string;
let friendToken: string;

describe("Credit Cards", () => {
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

    const friendEmail = `card-friend-${Date.now()}@email.com`;
    const friendPassword = "123456";

    const createFriendResponse = await request(app.server)
      .post("/admin/friends")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Friend Cartao",
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
    await prisma.creditCard.deleteMany({
      where: {
        name: {
          contains: "Cartao Teste",
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "card-friend-",
        },
      },
    });

    await app.close();
  });

  it("não deve criar cartão sem token", async () => {
    const response = await request(app.server).post("/credit-cards").send({
      name: "Cartao Teste Sem Token",
      brand: "Mastercard",
      lastDigits: "1234",
      limit: 1000,
      closingDay: 25,
      dueDay: 2,
    });

    expect(response.statusCode).toBe(401);
  });

  it("não deve permitir friend criar cartão", async () => {
    const response = await request(app.server)
      .post("/credit-cards")
      .set("Authorization", `Bearer ${friendToken}`)
      .send({
        name: "Cartao Teste Friend",
        brand: "Mastercard",
        lastDigits: "1234",
        limit: 1000,
        closingDay: 25,
        dueDay: 2,
      });

    expect(response.statusCode).toBe(403);
  });

  it("deve permitir admin criar cartão", async () => {
    const response = await request(app.server)
      .post("/credit-cards")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: `Cartao Teste ${Date.now()}`,
        brand: "Mastercard",
        lastDigits: "1234",
        limit: 1000,
        closingDay: 25,
        dueDay: 2,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: expect.stringContaining("Cartao Teste"),
      brand: "Mastercard",
      lastDigits: "1234",
      limit: expect.any(String),
      closingDay: 25,
      dueDay: 2,
      ownerId: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it("deve permitir admin listar cartões", async () => {
    const response = await request(app.server)
      .get("/credit-cards")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
