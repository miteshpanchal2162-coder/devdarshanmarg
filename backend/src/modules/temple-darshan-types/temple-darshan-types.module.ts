import { Module } from "@nestjs/common";
import { TempleDarshanTypesController } from "./temple-darshan-types.controller";
import { TempleDarshanTypesService } from "./temple-darshan-types.service";

@Module({
  controllers: [TempleDarshanTypesController],
  providers: [TempleDarshanTypesService],
})
export class TempleDarshanTypesModule {}
