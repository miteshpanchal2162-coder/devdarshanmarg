import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Test, TestingModule } from "@nestjs/testing";
import { Logger } from "nestjs-pino";
import { AppModule } from "../../src/app.module";
import { AllExceptionsFilter } from "../../src/common/filters/all-exceptions.filter";
import { ResponseInterceptor } from "../../src/common/interceptors/response.interceptor";
import { getUploadRoot } from "../../src/common/storage/storage.constants";

export async function createE2eApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>({ bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const { default: expressStatic } = await import("express");
  app.useStaticAssets(getUploadRoot(), { prefix: "/uploads/" });

  await app.init();
  return app;
}

export function getConfig(app: NestExpressApplication) {
  return app.get(ConfigService);
}
