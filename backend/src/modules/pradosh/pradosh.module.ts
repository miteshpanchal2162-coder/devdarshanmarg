import { Module } from "@nestjs/common";
import { PradoshController } from "./pradosh.controller";
import { PradoshService } from "./pradosh.service";

@Module({
  controllers: [PradoshController],
  providers: [PradoshService],
})
export class PradoshModule {}
