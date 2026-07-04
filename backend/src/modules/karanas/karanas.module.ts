import { Module } from "@nestjs/common";
import { KaranasController } from "./karanas.controller";
import { KaranasService } from "./karanas.service";

@Module({
  controllers: [KaranasController],
  providers: [KaranasService],
})
export class KaranasModule {}
