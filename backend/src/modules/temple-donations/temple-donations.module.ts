import { Module } from "@nestjs/common";
import { TempleDonationsController } from "./temple-donations.controller";
import { TempleDonationsService } from "./temple-donations.service";

@Module({
  controllers: [TempleDonationsController],
  providers: [TempleDonationsService],
})
export class TempleDonationsModule {}
