import { Module } from "@nestjs/common";
import { TempleParkingController } from "./temple-parking.controller";
import { TempleParkingService } from "./temple-parking.service";

@Module({
  controllers: [TempleParkingController],
  providers: [TempleParkingService],
})
export class TempleParkingModule {}
