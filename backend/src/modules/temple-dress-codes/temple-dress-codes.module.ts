import { Module } from "@nestjs/common";
import { TempleDressCodesController } from "./temple-dress-codes.controller";
import { TempleDressCodesService } from "./temple-dress-codes.service";

@Module({
  controllers: [TempleDressCodesController],
  providers: [TempleDressCodesService],
})
export class TempleDressCodesModule {}
