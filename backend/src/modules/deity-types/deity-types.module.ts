import { Module } from "@nestjs/common";
import { DeityTypesController } from "./deity-types.controller";
import { DeityTypesService } from "./deity-types.service";

@Module({
  controllers: [DeityTypesController],
  providers: [DeityTypesService],
})
export class DeityTypesModule {}
