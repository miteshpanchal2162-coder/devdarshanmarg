import { Module } from "@nestjs/common";
import { EkadashiController } from "./ekadashi.controller";
import { EkadashiService } from "./ekadashi.service";

@Module({
  controllers: [EkadashiController],
  providers: [EkadashiService],
})
export class EkadashiModule {}
