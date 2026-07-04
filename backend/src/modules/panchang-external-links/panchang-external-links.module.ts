import { Module } from "@nestjs/common";
import { PanchangExternalLinksController } from "./panchang-external-links.controller";
import { PanchangExternalLinksService } from "./panchang-external-links.service";

@Module({
  controllers: [PanchangExternalLinksController],
  providers: [PanchangExternalLinksService],
})
export class PanchangExternalLinksModule {}
