import { Module } from "@nestjs/common";
import { AmavasyaController } from "./amavasya.controller";
import { AmavasyaService } from "./amavasya.service";

@Module({
  controllers: [AmavasyaController],
  providers: [AmavasyaService],
})
export class AmavasyaModule {}
