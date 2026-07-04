import { Module } from "@nestjs/common";
import { TempleRoutesController } from "./temple-routes.controller";
import { TempleRoutesService } from "./temple-routes.service";

@Module({
  controllers: [TempleRoutesController],
  providers: [TempleRoutesService],
})
export class TempleRoutesModule {}
