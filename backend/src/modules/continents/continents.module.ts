import { Module } from "@nestjs/common";
import { ContinentsController } from "./continents.controller";
import { ContinentsService } from "./continents.service";

@Module({
  controllers: [ContinentsController],
  providers: [ContinentsService],
})
export class ContinentsModule {}
