import { compare } from "bcryptjs";

import { AppError } from "../../shared/errors/app.error.js";
import { usersRepository } from "../users/users.repository.js";
import type { LoginBody } from "./auth.schema.js";

export const authService = {
  async login(data: LoginBody) {
    const user = await usersRepository.findByEmailWithPassword(data.email);

    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const passwordMatches = await compare(data.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Credenciais inválidas", 401);
    }

    return user;
  },
};
