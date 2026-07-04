import { Module } from "@nestjs/common";
import { TempleExternalLinksController } from "./temple-external-links.controller";
import { TempleExternalLinksService } from "./temple-external-links.service";

@Module({
  controllers: [TempleExternalLinksController],
  providers: [TempleExternalLinksService],
})
export class TempleExternalLinksModule {}
