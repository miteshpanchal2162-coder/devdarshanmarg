import { Module } from "@nestjs/common";
import { ContentSeoController } from "./content-seo.controller";
import { ContentSeoService } from "./content-seo.service";

@Module({
  controllers: [ContentSeoController],
  providers: [ContentSeoService],
})
export class ContentSeoModule {}
