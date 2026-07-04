import { Module } from "@nestjs/common";
import { PurnimaController } from "./purnima.controller";
import { PurnimaService } from "./purnima.service";

@Module({
  controllers: [PurnimaController],
  providers: [PurnimaService],
})
export class PurnimaModule {}
