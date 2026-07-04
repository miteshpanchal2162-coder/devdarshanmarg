import { Injectable } from "@nestjs/common";
import { TempleDressCode } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleDressCodesService extends TempleChildCrudService<TempleDressCode> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeDressCode, {
      messageName: "Temple dress code",
      searchableFields: ["dressCode", "gender", "title", "description", "applicableAgeGroup"],
      uniqueField: "dressCode",
    }, relationValidation);
  }
}
