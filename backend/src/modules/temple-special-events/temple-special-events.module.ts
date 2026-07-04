import { Module } from "@nestjs/common";
import { TempleSpecialEventsController } from "./temple-special-events.controller";
import { TempleSpecialEventsService } from "./temple-special-events.service";

@Module({
  controllers: [TempleSpecialEventsController],
  providers: [TempleSpecialEventsService],
})
export class TempleSpecialEventsModule {}
