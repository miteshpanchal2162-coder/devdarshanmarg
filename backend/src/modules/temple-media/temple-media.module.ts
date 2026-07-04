import { Module } from "@nestjs/common";
import { TempleMediaController } from "./temple-media.controller";
import { TempleMediaService } from "./temple-media.service";

@Module({
  controllers: [TempleMediaController],
  providers: [TempleMediaService],
})
export class TempleMediaModule {}
