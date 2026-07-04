import { Module } from "@nestjs/common";
import { DeityExternalLinksController } from "./deity-external-links.controller";
import { DeityExternalLinksService } from "./deity-external-links.service";

@Module({
  controllers: [DeityExternalLinksController],
  providers: [DeityExternalLinksService],
})
export class DeityExternalLinksModule {}
