import { Module } from "@nestjs/common";
import { FestivalBhajansController } from "./festival-bhajans.controller";
import { FestivalBhajansService } from "./festival-bhajans.service";

@Module({
  controllers: [FestivalBhajansController],
  providers: [FestivalBhajansService],
})
export class FestivalBhajansModule {}
