export const appConfig = () => ({
  app: {
    env: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 4000),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  otp: {
    expiresIn: process.env.OTP_EXPIRES_IN ?? "5m",
    maxRetries: Number(process.env.OTP_MAX_RETRIES ?? 5),
    verificationTokenExpiresIn: process.env.OTP_VERIFICATION_TOKEN_EXPIRES_IN ?? "10m",
  },
  swagger: {
    title: process.env.SWAGGER_TITLE ?? "DevDarshanMarg API",
    description:
      process.env.SWAGGER_DESCRIPTION ?? "DevDarshanMarg backend API",
    version: process.env.SWAGGER_VERSION ?? "1.0.0",
    path: process.env.SWAGGER_PATH ?? "docs",
    enabled: process.env.SWAGGER_ENABLED === "true",
  },
  cors: {
    origin:
      (process.env.NODE_ENV ?? "development") === "production"
        ? (process.env.CORS_ORIGIN?.split(",").map((value) => value.trim()).filter(Boolean) ?? [])
        : (process.env.CORS_ORIGIN?.split(",").map((value) => value.trim()).filter(Boolean) ??
          true),
    credentials: process.env.CORS_CREDENTIALS !== "false",
  },
  storage: {
    uploadPath: process.env.UPLOAD_DIR ?? process.env.UPLOAD_PATH ?? "uploads",
  },
});
