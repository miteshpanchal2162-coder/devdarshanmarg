import { Injectable } from "@nestjs/common";
import { VratFoodRule } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { VratChildCrudService } from "../vrat-child-common/vrat-child-crud.service";

@Injectable()
export class VratFoodRulesService extends VratChildCrudService<VratFoodRule> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.vratFoodRule,
      {
        allowedFilterFields: ["foodType", "allowed"],
        allowedSortFields: ["foodType", "foodName", "allowed"],
        messageName: "Vrat food rule",
        searchableFields: ["foodType", "foodName", "remarks"],
        uniqueField: "foodName",
      },
      relationValidation,
    );
  }
}
