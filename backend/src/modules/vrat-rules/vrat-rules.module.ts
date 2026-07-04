import { Module } from "@nestjs/common";
import { VratRulesController } from "./vrat-rules.controller";
import { VratRulesService } from "./vrat-rules.service";

@Module({
  controllers: [VratRulesController],
  providers: [VratRulesService],
})
export class VratRulesModule {}
