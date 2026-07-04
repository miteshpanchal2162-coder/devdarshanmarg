import { Module } from "@nestjs/common";
import { TempleRulesController } from "./temple-rules.controller";
import { TempleRulesService } from "./temple-rules.service";

@Module({
  controllers: [TempleRulesController],
  providers: [TempleRulesService],
})
export class TempleRulesModule {}
