import { Module } from "@nestjs/common";
import { PanchangSourcesController } from "./panchang-sources.controller";
import { PanchangSourcesService } from "./panchang-sources.service";

@Module({
  controllers: [PanchangSourcesController],
  providers: [PanchangSourcesService],
})
export class PanchangSourcesModule {}
