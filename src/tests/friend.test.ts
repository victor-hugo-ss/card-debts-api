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

describe("Friend", () => {
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
        name: "Friend Area",
        email: `friend-area-${Date.now()}@email.com`,
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
        name: `Cartao Friend Area ${Date.now()}`,
        brand: "Mastercard",
        lastDigits: "1111",
        limit: 2000,
        closingDay: 25,
        dueDay: 2,
      });

    creditCardId = createCardResponse.body.id;

    const createPurchaseResponse = await request(app.server)
      .post("/purchases")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        description: "Compra Friend Area",
        amount: 300,
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

  it("não deve permitir admin acessar resumo do friend", async () => {
    const response = await request(app.server)
      .get("/friend/summary")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(403);
  });

  it("deve permitir friend acessar resumo", async () => {
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

  it("deve permitir friend listar suas compras", async () => {
    const response = await request(app.server)
      .get("/friend/purchases")
      .set("Authorization", `Bearer ${friendToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        description: expect.any(String),
        installments: expect.any(Array),
      }),
    );
  });

  it("deve permitir friend listar suas parcelas", async () => {
    const response = await request(app.server)
      .get("/friend/installments")
      .set("Authorization", `Bearer ${friendToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        number: expect.any(Number),
        status: "PENDING",
      }),
    );
  });

  it("deve permitir friend filtrar parcelas pendentes", async () => {
    const response = await request(app.server)
      .get("/friend/installments?status=PENDING")
      .set("Authorization", `Bearer ${friendToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(
      response.body.every(
        (item: { status: string }) => item.status === "PENDING",
      ),
    ).toBe(true);
  });
});
