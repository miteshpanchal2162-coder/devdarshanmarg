import { Module } from "@nestjs/common";
import { DeityRelationsController } from "./deity-relations.controller";
import { DeityRelationsService } from "./deity-relations.service";

@Module({
  controllers: [DeityRelationsController],
  providers: [DeityRelationsService],
})
export class DeityRelationsModule {}
