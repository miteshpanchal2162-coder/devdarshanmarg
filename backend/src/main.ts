import "reflect-metadata";
import compression from "compression";
import helmet from "helmet";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Logger as PinoLogger } from "nestjs-pino";

import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { RequestLoggingInterceptor } from "./common/interceptors/request-logging.interceptor";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { getUploadRoot } from "./common/storage/storage.constants";
import { buildHelmetOptions } from "./config/helmet.config";
import { setupSwagger } from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  app.useLogger(app.get(PinoLogger));
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");
  const isProduction = (configService.get<string>("app.env") ?? process.env.NODE_ENV) === "production";

  app.enableShutdownHooks();
  app.use(helmet(buildHelmetOptions(isProduction)));
  app.use(compression());
  app.enableCors({
    credentials: configService.get<boolean>("cors.credentials") ?? true,
    origin: configService.get<string[] | boolean>("cors.origin") ?? true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(
    new RequestLoggingInterceptor(),
    new ResponseInterceptor(),
  );

  app.useStaticAssets(getUploadRoot(), { prefix: "/uploads/" });

  setupSwagger(app, configService);

  const port = configService.get<number>("app.port") ?? 4000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);

  const shutdown = async (signal: string) => {
    logger.log(`Received ${signal}. Starting graceful shutdown...`);
    try {
      await app.close();
      logger.log("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      logger.error("Graceful shutdown failed", error instanceof Error ? error.stack : undefined);
      process.exit(1);
    }
  };

  process.once("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.once("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

void bootstrap();
