import { Module } from "@nestjs/common";
import { DeityAttributesController } from "./deity-attributes.controller";
import { DeityAttributesService } from "./deity-attributes.service";

@Module({
  controllers: [DeityAttributesController],
  providers: [DeityAttributesService],
})
export class DeityAttributesModule {}
