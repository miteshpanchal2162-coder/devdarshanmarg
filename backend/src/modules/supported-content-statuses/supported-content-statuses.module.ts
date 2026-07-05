import { Module } from "@nestjs/common";
import { SupportedContentStatusesController } from "./supported-content-statuses.controller";
import { SupportedContentStatusesService } from "./supported-content-statuses.service";

@Module({
  controllers: [SupportedContentStatusesController],
  providers: [SupportedContentStatusesService],
})
export class SupportedContentStatusesModule {}
