import { prisma } from "../../shared/database/prisma-client.js";

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

  create(data: CreateUserData) {
    return prisma.user.create({
      data,
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
