import { prisma } from "../../shared/database/prisma-client.js";
import type {
  CreateFriendByAdminInput,
  UpdateFriendInput,
} from "./users.schema.js";

export const usersRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  findByEmailWithPassword(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        isActive: true,
      },
    });
  },

  findById(id: string) {
    return prisma.user.findFirst({
      where: {
        id,
        isActive: true,
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

  findFriendById(id: string) {
    return prisma.user.findFirst({
      where: {
        id,
        role: "FRIEND",
        isActive: true,
      },
    });
  },

  findManyFriends() {
    return prisma.user.findMany({
      where: {
        role: "FRIEND",
        isActive: true,
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

  updateFriend(
    id: string,
    data: UpdateFriendInput & { passwordHash?: string },
  ) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  },

  deactivateFriend(id: string) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  },
};



