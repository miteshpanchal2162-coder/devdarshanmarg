import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const env = configService.get<string>("app.env") ?? "development";
  const enabled = configService.get<boolean>("swagger.enabled") ?? false;

  if (env === "production" && !enabled) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle(configService.get<string>("swagger.title") ?? "DevDarshanMarg API")
    .setDescription(
      configService.get<string>("swagger.description") ??
        "DevDarshanMarg backend API",
    )
    .setVersion(configService.get<string>("swagger.version") ?? "1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    configService.get<string>("swagger.path") ?? "docs",
    app,
    document,
  );
}
