import { Module } from "@nestjs/common";
import { FestivalSamagriController } from "./festival-samagri.controller";
import { FestivalSamagriService } from "./festival-samagri.service";

@Module({
  controllers: [FestivalSamagriController],
  providers: [FestivalSamagriService],
})
export class FestivalSamagriModule {}
