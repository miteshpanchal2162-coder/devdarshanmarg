import { Module } from "@nestjs/common";
import { VratDatesController } from "./vrat-dates.controller";
import { VratDatesService } from "./vrat-dates.service";

@Module({
  controllers: [VratDatesController],
  providers: [VratDatesService],
})
export class VratDatesModule {}
