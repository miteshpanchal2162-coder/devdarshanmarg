import { Module } from "@nestjs/common";
import { ContentVersionsController } from "./content-versions.controller";
import { ContentVersionsService } from "./content-versions.service";

@Module({
  controllers: [ContentVersionsController],
  providers: [ContentVersionsService],
})
export class ContentVersionsModule {}
