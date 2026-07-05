import { Module } from "@nestjs/common";
import { SeoLandingPagesController } from "./seo-landing-pages.controller";
import { SeoLandingPagesService } from "./seo-landing-pages.service";

@Module({
  controllers: [SeoLandingPagesController],
  providers: [SeoLandingPagesService],
})
export class SeoLandingPagesModule {}
