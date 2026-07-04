import { Module } from "@nestjs/common";
import { TempleLiveDarshanController } from "./temple-live-darshan.controller";
import { TempleLiveDarshanService } from "./temple-live-darshan.service";

@Module({
  controllers: [TempleLiveDarshanController],
  providers: [TempleLiveDarshanService],
})
export class TempleLiveDarshanModule {}
