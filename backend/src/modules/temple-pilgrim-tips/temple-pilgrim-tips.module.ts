import { Module } from "@nestjs/common";
import { TemplePilgrimTipsController } from "./temple-pilgrim-tips.controller";
import { TemplePilgrimTipsService } from "./temple-pilgrim-tips.service";

@Module({
  controllers: [TemplePilgrimTipsController],
  providers: [TemplePilgrimTipsService],
})
export class TemplePilgrimTipsModule {}
