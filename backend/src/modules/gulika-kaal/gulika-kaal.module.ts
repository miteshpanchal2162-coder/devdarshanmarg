import { Module } from "@nestjs/common";
import { GulikaKaalController } from "./gulika-kaal.controller";
import { GulikaKaalService } from "./gulika-kaal.service";

@Module({
  controllers: [GulikaKaalController],
  providers: [GulikaKaalService],
})
export class GulikaKaalModule {}
