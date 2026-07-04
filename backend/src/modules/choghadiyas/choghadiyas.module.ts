import { Module } from "@nestjs/common";
import { ChoghadiyasController } from "./choghadiyas.controller";
import { ChoghadiyasService } from "./choghadiyas.service";

@Module({
  controllers: [ChoghadiyasController],
  providers: [ChoghadiyasService],
})
export class ChoghadiyasModule {}
