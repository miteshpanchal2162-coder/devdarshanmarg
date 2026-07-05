import { config as loadEnv } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

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
process.env.LOG_LEVEL ??= "error";
process.env.JWT_ACCESS_SECRET ??= "test-access-secret-minimum-32-characters";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret-minimum-32-characters";
process.env.OTP_EXPIRES_IN ??= "5m";
process.env.OTP_MAX_RETRIES ??= "5";
process.env.OTP_VERIFICATION_TOKEN_EXPIRES_IN ??= "10m";
process.env.UPLOAD_DIR ??= resolve(root, "test-uploads");
process.env.DATABASE_URL ??=
  "postgresql://postgres:postgres@127.0.0.1:5432/devdarshanmarg_test?schema=public";
