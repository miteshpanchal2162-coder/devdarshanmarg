import { Injectable } from "@nestjs/common";
import { FestivalFastingRule } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalFastingRulesService extends FestivalChildCrudService<FestivalFastingRule> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalFastingRule,
      {
        allowedFilterFields: ["fastType", "strictness"],
        allowedSortFields: ["fastType", "title"],
        messageName: "Festival fasting rule",
        searchableFields: ["title", "ruleCode", "description", "fastType", "applicableFor"],
        uniqueField: "ruleCode",
      },
      relationValidation,
    );
  }
}
