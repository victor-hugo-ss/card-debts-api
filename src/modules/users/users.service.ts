import { hash } from "bcryptjs";

import { usersRepository } from "./users.repository.js";
import type { CreateUserBody } from "./users.schema.js";
import { AppError } from "../../shared/errors/app.error.js";

export const usersService = {
  async create(data: CreateUserBody) {
    const userAlreadyExists = await usersRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new AppError("E-mail já cadastrado", 409);
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
