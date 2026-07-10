import type { FastifyInstance } from "fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildApp } from "../app.js";
import { env } from "../shared/config/env.js";
import { prisma } from "../shared/database/prisma-client.js";

let app: FastifyInstance;
let adminToken: string;
let friendId: string;
let friendEmail: string;

const oldPassword = "123456";
const newPassword = "654321";

describe("Users", () => {
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
    friendEmail = `users-friend-${Date.now()}@email.com`;

    const createFriendResponse = await request(app.server)
      .post("/admin/friends")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Users Friend",
        email: friendEmail,
        password: oldPassword,
      });

    friendId = createFriendResponse.body.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: "users-friend-",
        },
      },
    });

    await app.close();
  });

  it("deve permitir admin atualizar a senha de um amigo", async () => {
    const updateResponse = await request(app.server)
      .patch(`/admin/friends/${friendId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        password: newPassword,
      });

    expect(updateResponse.statusCode).toBe(200);

    const oldLoginResponse = await request(app.server).post("/sessions").send({
      email: friendEmail,
      password: oldPassword,
    });

    expect(oldLoginResponse.statusCode).toBe(401);

    const newLoginResponse = await request(app.server).post("/sessions").send({
      email: friendEmail,
      password: newPassword,
    });

    expect(newLoginResponse.statusCode).toBe(200);
    expect(newLoginResponse.body).toEqual({
      token: expect.any(String),
    });
  });
});

