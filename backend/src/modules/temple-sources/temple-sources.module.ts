import { Module } from "@nestjs/common";
import { TempleSourcesController } from "./temple-sources.controller";
import { TempleSourcesService } from "./temple-sources.service";

@Module({
  controllers: [TempleSourcesController],
  providers: [TempleSourcesService],
})
export class TempleSourcesModule {}
