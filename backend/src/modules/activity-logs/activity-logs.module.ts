import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ActivityLoggingInterceptor } from "./activity-logging.interceptor";
import { ActivityLogsController } from "./activity-logs.controller";
import { ActivityLogsService } from "./activity-logs.service";

@Module({
  controllers: [ActivityLogsController],
  providers: [
    ActivityLogsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLoggingInterceptor,
    },
  ],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
