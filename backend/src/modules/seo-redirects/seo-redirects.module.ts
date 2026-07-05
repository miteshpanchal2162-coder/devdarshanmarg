import { Module } from "@nestjs/common";
import { SeoRedirectsController } from "./seo-redirects.controller";
import { SeoRedirectsService } from "./seo-redirects.service";

@Module({
  controllers: [SeoRedirectsController],
  providers: [SeoRedirectsService],
})
export class SeoRedirectsModule {}
