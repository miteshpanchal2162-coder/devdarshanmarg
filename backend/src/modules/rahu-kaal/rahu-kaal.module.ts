import { Module } from "@nestjs/common";
import { RahuKaalController } from "./rahu-kaal.controller";
import { RahuKaalService } from "./rahu-kaal.service";

@Module({
  controllers: [RahuKaalController],
  providers: [RahuKaalService],
})
export class RahuKaalModule {}
