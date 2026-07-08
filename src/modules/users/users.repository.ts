import { prisma } from "../../shared/database/prisma-client.js";
import type { CreateFriendByAdminInput } from "./users.schema.js";

type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
};

export const usersRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  findByEmailWithPassword(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },

  findManyFriends() {
    return prisma.user.findMany({
      where: {
        role: "FRIEND",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  createFriendByAdmin(
    data: CreateFriendByAdminInput & { passwordHash: string },
  ) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: "FRIEND",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },
};
