import { Module } from "@nestjs/common";
import { VratBenefitsController } from "./vrat-benefits.controller";
import { VratBenefitsService } from "./vrat-benefits.service";

@Module({
  controllers: [VratBenefitsController],
  providers: [VratBenefitsService],
})
export class VratBenefitsModule {}
