import { Module } from "@nestjs/common";
import { DeityAssociationsController } from "./deity-associations.controller";
import { DeityAssociationsService } from "./deity-associations.service";

@Module({
  controllers: [DeityAssociationsController],
  providers: [DeityAssociationsService],
})
export class DeityAssociationsModule {}
