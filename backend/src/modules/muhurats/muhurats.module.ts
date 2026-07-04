import { Module } from "@nestjs/common";
import { MuhuratsController } from "./muhurats.controller";
import { MuhuratsService } from "./muhurats.service";

@Module({
  controllers: [MuhuratsController],
  providers: [MuhuratsService],
})
export class MuhuratsModule {}
