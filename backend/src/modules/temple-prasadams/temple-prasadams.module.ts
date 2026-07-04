import { Module } from "@nestjs/common";
import { TemplePrasadamsController } from "./temple-prasadams.controller";
import { TemplePrasadamsService } from "./temple-prasadams.service";

@Module({
  controllers: [TemplePrasadamsController],
  providers: [TemplePrasadamsService],
})
export class TemplePrasadamsModule {}
