import "reflect-metadata";
import compression from "compression";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { setupSwagger } from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  app.use(helmet());
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
  app.useGlobalInterceptors(new ResponseInterceptor());

  setupSwagger(app, configService);

  const port = configService.get<number>("app.port") ?? 4000;
  await app.listen(port);
}

void bootstrap();
