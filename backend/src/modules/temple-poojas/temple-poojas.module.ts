import { Module } from "@nestjs/common";
import { TemplePoojasController } from "./temple-poojas.controller";
import { TemplePoojasService } from "./temple-poojas.service";

@Module({
  controllers: [TemplePoojasController],
  providers: [TemplePoojasService],
})
export class TemplePoojasModule {}
