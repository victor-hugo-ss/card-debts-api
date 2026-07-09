import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const databaseUrl =
  env("DATABASE_URL") ?? "postgresql://user:password@localhost:5432/card_debts";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
