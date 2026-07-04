import { Module } from "@nestjs/common";
import { YamagandaKaalController } from "./yamaganda-kaal.controller";
import { YamagandaKaalService } from "./yamaganda-kaal.service";

@Module({
  controllers: [YamagandaKaalController],
  providers: [YamagandaKaalService],
})
export class YamagandaKaalModule {}
