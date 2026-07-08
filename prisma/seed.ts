import { hash } from "bcryptjs";

import { env } from "../src/shared/config/env";
import { prisma } from "../src/shared/database/prisma-client";

async function main() {
  const adminAlreadyExists = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (adminAlreadyExists) {
    console.log("Usuário admin já existe");
    return;
  }

  const passwordHash = await hash(env.ADMIN_PASSWORD, 8);

  await prisma.user.create({
    data: {
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Usuário admin criado com sucesso");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
