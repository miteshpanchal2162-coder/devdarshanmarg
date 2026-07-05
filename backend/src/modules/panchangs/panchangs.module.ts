import { Module } from "@nestjs/common";
import { PanchangsController } from "./panchangs.controller";
import { PanchangsService } from "./panchangs.service";

@Module({
  controllers: [PanchangsController],
  providers: [PanchangsService],
  exports: [PanchangsService],
})
export class PanchangsModule {}
