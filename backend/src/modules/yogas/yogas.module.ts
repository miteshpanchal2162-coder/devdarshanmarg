import { Module } from "@nestjs/common";
import { YogasController } from "./yogas.controller";
import { YogasService } from "./yogas.service";

@Module({
  controllers: [YogasController],
  providers: [YogasService],
})
export class YogasModule {}
