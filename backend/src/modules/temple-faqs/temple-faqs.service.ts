import { Injectable } from "@nestjs/common";
import { TempleFaq } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleFaqsService extends TempleChildCrudService<TempleFaq> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeFaq, {
      messageName: "Temple FAQ",
      searchableFields: ["faqCode", "category", "question", "answer", "searchKeywords"],
      uniqueField: "faqCode",
    }, relationValidation);
  }
}
