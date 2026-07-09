import type { FastifyInstance } from "fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildApp } from "../app.js";
import { env } from "../shared/config/env.js";
import { prisma } from "../shared/database/prisma-client.js";

let app: FastifyInstance;
let adminToken: string;
let friendToken: string;
let friendId: string;
let creditCardId: string;

describe("Purchases", () => {
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

    const friendPassword = "123456";

    const createFriendResponse = await request(app.server)
      .post("/admin/friends")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Friend Compra",
        email: `purchase-friend-${Date.now()}@email.com`,
        password: friendPassword,
      });

    friendId = createFriendResponse.body.id;

    const friendLoginResponse = await request(app.server)
      .post("/sessions")
      .send({
        email: createFriendResponse.body.email,
        password: friendPassword,
      });

    friendToken = friendLoginResponse.body.token;

    const createCardResponse = await request(app.server)
      .post("/credit-cards")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: `Cartao Compra Teste ${Date.now()}`,
        brand: "Mastercard",
        lastDigits: "4321",
        limit: 5000,
        closingDay: 25,
        dueDay: 2,
      });

    creditCardId = createCardResponse.body.id;
  });

  afterAll(async () => {
    await prisma.purchase.deleteMany({
      where: {
        description: {
          contains: "Compra Teste",
        },
      },
    });

    await prisma.creditCard.deleteMany({
      where: {
        id: creditCardId,
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: friendId,
      },
    });

    await app.close();
  });

  it("não deve permitir friend criar compra", async () => {
    const response = await request(app.server)
      .post("/purchases")
      .set("Authorization", `Bearer ${friendToken}`)
      .send({
        description: "Compra Teste Friend",
        amount: 300,
        purchaseDate: "2026-07-10",
        installmentsCount: 3,
        friendId,
        creditCardId,
      });

    expect(response.statusCode).toBe(403);
  });

  it("deve criar compra e gerar parcelas", async () => {
    const response = await request(app.server)
      .post("/purchases")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        description: "Compra Teste Parcelas",
        amount: 300,
        purchaseDate: "2026-07-10",
        installmentsCount: 3,
        friendId,
        creditCardId,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.installments).toHaveLength(3);
    expect(response.body.installments[0]).toEqual(
      expect.objectContaining({
        number: 1,
        status: "PENDING",
      }),
    );
  });

  it("deve colocar compra antes do fechamento na próxima fatura", async () => {
    const response = await request(app.server)
      .post("/purchases")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        description: "Compra Teste Antes Fechamento",
        amount: 300,
        purchaseDate: "2026-07-10",
        installmentsCount: 1,
        friendId,
        creditCardId,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.installments[0].dueDate).toBe(
      "2026-08-02T00:00:00.000Z",
    );
  });

  it("deve colocar compra no dia do fechamento na próxima fatura", async () => {
    const response = await request(app.server)
      .post("/purchases")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        description: "Compra Teste Dia Fechamento",
        amount: 300,
        purchaseDate: "2026-07-25",
        installmentsCount: 1,
        friendId,
        creditCardId,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.installments[0].dueDate).toBe(
      "2026-08-02T00:00:00.000Z",
    );
  });

  it("deve colocar compra depois do fechamento na fatura seguinte", async () => {
    const response = await request(app.server)
      .post("/purchases")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        description: "Compra Teste Depois Fechamento",
        amount: 300,
        purchaseDate: "2026-07-26",
        installmentsCount: 1,
        friendId,
        creditCardId,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.installments[0].dueDate).toBe(
      "2026-09-02T00:00:00.000Z",
    );
  });
});
