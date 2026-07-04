import { Module } from "@nestjs/common";
import { SankashtiController } from "./sankashti.controller";
import { SankashtiService } from "./sankashti.service";

@Module({
  controllers: [SankashtiController],
  providers: [SankashtiService],
})
export class SankashtiModule {}
