import { config as loadEnv } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

export default async function globalSetup() {
  const root = resolve(__dirname, "../..");

  for (const file of [".env.test", ".env"]) {
    const path = resolve(root, file);
    if (existsSync(path)) {
      loadEnv({ path });
      break;
    }
  }

  process.env.NODE_ENV = "test";
  process.env.SWAGGER_ENABLED ??= "false";
  process.env.JWT_ACCESS_SECRET ??= "test-access-secret-minimum-32-characters";
  process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret-minimum-32-characters";
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:5432/devdarshanmarg_test?schema=public";

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    process.env.E2E_DB_AVAILABLE = "true";
  } catch {
    process.env.E2E_DB_AVAILABLE = "false";
  } finally {
    await prisma.$disconnect();
  }
}
