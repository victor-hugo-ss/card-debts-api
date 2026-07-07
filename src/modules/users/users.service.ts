import { hash } from "bcryptjs";

import { usersRepository } from "./user.repository.js";
import type { CreateUserBody } from "./users.schema.js";

export const usersService = {
  async create(data: CreateUserBody) {
    const userAlreadyExists = await usersRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error("E-mail já cadastrado");
    }

    const passwordHash = await hash(data.password, 8);

    const user = await usersRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    return user;
  },
};
