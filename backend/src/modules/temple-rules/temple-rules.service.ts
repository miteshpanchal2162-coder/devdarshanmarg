import { Injectable } from "@nestjs/common";
import { TempleRule } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleRulesService extends TempleChildCrudService<TempleRule> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeRule, {
      messageName: "Temple rule",
      searchableFields: ["ruleCode", "title", "description", "ruleType", "applicableFor"],
      uniqueField: "ruleCode",
    }, relationValidation);
  }
}
