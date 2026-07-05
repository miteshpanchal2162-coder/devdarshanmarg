import { Module } from "@nestjs/common";
import { DeitiesController } from "./deities.controller";
import { DeitiesService } from "./deities.service";

@Module({
  controllers: [DeitiesController],
  providers: [DeitiesService],
  exports: [DeitiesService],
})
export class DeitiesModule {}
