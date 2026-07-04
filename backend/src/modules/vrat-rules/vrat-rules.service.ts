import { Injectable } from "@nestjs/common";
import { VratRule } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { VratChildCrudService } from "../vrat-child-common/vrat-child-crud.service";

@Injectable()
export class VratRulesService extends VratChildCrudService<VratRule> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.vratRule,
      {
        allowedSortFields: ["ruleTitle"],
        messageName: "Vrat rule",
        searchableFields: ["ruleTitle", "description"],
        uniqueField: "ruleTitle",
      },
      relationValidation,
    );
  }
}
