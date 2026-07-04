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
  swagger: {
    title: process.env.SWAGGER_TITLE ?? "DevDarshanMarg API",
    description:
      process.env.SWAGGER_DESCRIPTION ?? "DevDarshanMarg backend API",
    version: process.env.SWAGGER_VERSION ?? "1.0.0",
    path: process.env.SWAGGER_PATH ?? "docs",
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") ?? true,
    credentials: process.env.CORS_CREDENTIALS !== "false",
  },
});
