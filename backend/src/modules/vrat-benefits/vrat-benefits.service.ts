import { Injectable } from "@nestjs/common";
import { VratBenefit } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { VratChildCrudService } from "../vrat-child-common/vrat-child-crud.service";

@Injectable()
export class VratBenefitsService extends VratChildCrudService<VratBenefit> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.vratBenefit,
      {
        allowedSortFields: ["benefitTitle"],
        messageName: "Vrat benefit",
        searchableFields: ["benefitTitle", "description"],
        uniqueField: "benefitTitle",
      },
      relationValidation,
    );
  }
}
