import { Module } from "@nestjs/common";
import { DeityStotrasController } from "./deity-stotras.controller";
import { DeityStotrasService } from "./deity-stotras.service";

@Module({
  controllers: [DeityStotrasController],
  providers: [DeityStotrasService],
})
export class DeityStotrasModule {}
