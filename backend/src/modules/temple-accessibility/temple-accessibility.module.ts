import { Module } from "@nestjs/common";
import { TempleAccessibilityController } from "./temple-accessibility.controller";
import { TempleAccessibilityService } from "./temple-accessibility.service";

@Module({
  controllers: [TempleAccessibilityController],
  providers: [TempleAccessibilityService],
})
export class TempleAccessibilityModule {}
