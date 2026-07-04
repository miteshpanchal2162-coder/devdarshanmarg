import { Module } from "@nestjs/common";
import { VratsController } from "./vrats.controller";
import { VratsService } from "./vrats.service";

@Module({
  controllers: [VratsController],
  providers: [VratsService],
})
export class VratsModule {}
