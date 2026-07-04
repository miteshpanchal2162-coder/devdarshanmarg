import { Module } from "@nestjs/common";
import { TempleFaqsController } from "./temple-faqs.controller";
import { TempleFaqsService } from "./temple-faqs.service";

@Module({
  controllers: [TempleFaqsController],
  providers: [TempleFaqsService],
})
export class TempleFaqsModule {}
