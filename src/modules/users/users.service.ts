import { hash } from "bcryptjs";

import { usersRepository } from "./users.repository.js";
import type { CreateFriendByAdminInput } from "./users.schema.js";
import { AppError } from "../../shared/errors/app.error.js";

export const usersService = {
  async getProfile(userId: string) {
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return user;
  },

  async listFriends() {
    return usersRepository.findManyFriends();
  },

  async createFriendByAdmin(data: CreateFriendByAdminInput) {
    const userAlreadyExists = await usersRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new AppError("E-mail já está em uso", 409);
    }

    const passwordHash = await hash(data.password, 8);

    return usersRepository.createFriendByAdmin({
      ...data,
      passwordHash,
    });
  },
};
