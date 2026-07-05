import { Module } from "@nestjs/common";
import { ContentAttachmentsController } from "./content-attachments.controller";
import { ContentAttachmentsService } from "./content-attachments.service";

@Module({
  controllers: [ContentAttachmentsController],
  providers: [ContentAttachmentsService],
})
export class ContentAttachmentsModule {}
