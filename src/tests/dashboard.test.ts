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
let purchaseId: string;

describe("Dashboard", () => {
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
        name: "Friend Dashboard",
        email: `dashboard-friend-${Date.now()}@email.com`,
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
        name: `Cartao Dashboard Teste ${Date.now()}`,
        brand: "Mastercard",
        lastDigits: "2222",
        limit: 4000,
        closingDay: 25,
        dueDay: 2,
      });

    creditCardId = createCardResponse.body.id;

    const createPurchaseResponse = await request(app.server)
      .post("/purchases")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        description: "Compra Dashboard Teste",
        amount: 600,
        purchaseDate: "2026-07-10",
        installmentsCount: 3,
        friendId,
        creditCardId,
      });

    purchaseId = createPurchaseResponse.body.id;
  });

  afterAll(async () => {
    await prisma.purchase.deleteMany({
      where: {
        id: purchaseId,
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

  it("não deve permitir friend acessar dashboard", async () => {
    const response = await request(app.server)
      .get("/dashboard/summary")
      .set("Authorization", `Bearer ${friendToken}`);

    expect(response.statusCode).toBe(403);
  });

  it("deve permitir admin acessar resumo geral", async () => {
    const response = await request(app.server)
      .get("/dashboard/summary")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      totalPurchases: expect.any(Number),
      totalPending: expect.any(Number),
      totalPaid: expect.any(Number),
      pendingInstallments: expect.any(Number),
      paidInstallments: expect.any(Number),
    });
  });

  it("deve permitir admin acessar resumo por amigo", async () => {
    const response = await request(app.server)
      .get("/dashboard/by-friend")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve permitir admin acessar resumo por cartão", async () => {
    const response = await request(app.server)
      .get("/dashboard/by-credit-card")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve permitir admin acessar próximos vencimentos", async () => {
    const response = await request(app.server)
      .get("/dashboard/upcoming-installments")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("deve permitir admin acessar resumo por mês", async () => {
    const response = await request(app.server)
      .get("/dashboard/by-month")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
