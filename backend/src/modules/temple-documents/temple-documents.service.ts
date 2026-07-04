import { Injectable } from "@nestjs/common";
import { TempleDocument } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleDocumentsService extends TempleChildCrudService<TempleDocument> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeDocument, {
      messageName: "Temple document",
      searchableFields: ["documentCode", "title", "documentType", "description", "version"],
      uniqueField: "documentCode",
    }, relationValidation);
  }
}
