import { Module } from "@nestjs/common";
import { TempleDocumentsController } from "./temple-documents.controller";
import { TempleDocumentsService } from "./temple-documents.service";

@Module({
  controllers: [TempleDocumentsController],
  providers: [TempleDocumentsService],
})
export class TempleDocumentsModule {}
