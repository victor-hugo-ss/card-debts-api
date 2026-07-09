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
let installmentId: string;

describe("Installments", () => {
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
        name: "Friend Parcela",
        email: `installment-friend-${Date.now()}@email.com`,
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
        name: `Cartao Parcela Teste ${Date.now()}`,
        brand: "Mastercard",
        lastDigits: "9876",
        limit: 3000,
        closingDay: 25,
        dueDay: 2,
      });

    creditCardId = createCardResponse.body.id;

    const createPurchaseResponse = await request(app.server)
      .post("/purchases")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        description: "Compra Teste Parcela",
        amount: 300,
        purchaseDate: "2026-07-10",
        installmentsCount: 3,
        friendId,
        creditCardId,
      });

    purchaseId = createPurchaseResponse.body.id;
    installmentId = createPurchaseResponse.body.installments[0].id;
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

  it("deve permitir admin listar parcelas", async () => {
    const response = await request(app.server)
      .get("/installments")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      data: expect.any(Array),
      meta: expect.objectContaining({
        page: expect.any(Number),
        perPage: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number),
      }),
    });
  });

  it("não deve permitir friend marcar parcela como paga", async () => {
    const response = await request(app.server)
      .patch(`/installments/${installmentId}/pay`)
      .set("Authorization", `Bearer ${friendToken}`);

    expect(response.statusCode).toBe(403);
  });

  it("deve permitir admin marcar parcela como paga", async () => {
    const response = await request(app.server)
      .patch(`/installments/${installmentId}/pay`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("PAID");
    expect(response.body.paidAt).toEqual(expect.any(String));
  });

  it("deve permitir admin desfazer pagamento da parcela", async () => {
    const response = await request(app.server)
      .patch(`/installments/${installmentId}/unpay`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("PENDING");
    expect(response.body.paidAt).toBeNull();
  });
});
