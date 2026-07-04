import { Module } from "@nestjs/common";
import { DeitySymbolsController } from "./deity-symbols.controller";
import { DeitySymbolsService } from "./deity-symbols.service";

@Module({
  controllers: [DeitySymbolsController],
  providers: [DeitySymbolsService],
})
export class DeitySymbolsModule {}
