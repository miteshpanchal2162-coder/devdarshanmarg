import { Injectable } from "@nestjs/common";
import { DeityMantra } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityMantrasService extends DeityChildCrudService<DeityMantra> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityMantra,
      {
        allowedFilterFields: ["languageId"],
        allowedSortFields: ["languageId", "name", "displayName"],
        messageName: "Deity mantra",
        searchableFields: ["name", "displayName", "mantraCode", "mantra", "meaning"],
        uniqueField: "mantraCode",
      },
      relationValidation,
    );
  }
}
