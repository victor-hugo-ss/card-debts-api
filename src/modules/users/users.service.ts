import { hash } from "bcryptjs";

import { usersRepository } from "./users.repository.js";
import type {
  CreateFriendByAdminInput,
  UpdateFriendInput,
} from "./users.schema.js";
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

  async updateFriend(id: string, data: UpdateFriendInput) {
    const friend = await usersRepository.findFriendById(id);

    if (!friend) {
      throw new AppError("Amigo não encontrado", 404);
    }

    if (data.email && data.email !== friend.email) {
      const userAlreadyExists = await usersRepository.findByEmail(data.email);

      if (userAlreadyExists) {
        throw new AppError("E-mail já está em uso", 409);
      }
    }

    const passwordHash = data.password ? await hash(data.password, 8) : undefined;

    return usersRepository.updateFriend(id, {
      name: data.name,
      email: data.email,
      passwordHash,
    });
  },

  async deactivateFriend(id: string) {
    const friend = await usersRepository.findFriendById(id);

    if (!friend) {
      throw new AppError("Amigo não encontrado", 404);
    }

    await usersRepository.deactivateFriend(id);
  },
};



