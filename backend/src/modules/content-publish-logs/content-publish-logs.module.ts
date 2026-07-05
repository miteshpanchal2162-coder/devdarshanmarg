import { Module } from "@nestjs/common";
import { ContentPublishLogsController } from "./content-publish-logs.controller";
import { ContentPublishLogsService } from "./content-publish-logs.service";

@Module({
  controllers: [ContentPublishLogsController],
  providers: [ContentPublishLogsService],
})
export class ContentPublishLogsModule {}
