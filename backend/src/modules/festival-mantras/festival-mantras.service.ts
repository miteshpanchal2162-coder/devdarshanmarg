import { Injectable } from "@nestjs/common";
import { FestivalMantra } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalMantrasService extends FestivalChildCrudService<FestivalMantra> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalMantra,
      {
        allowedFilterFields: ["languageId"],
        allowedSortFields: ["languageId", "name", "displayName"],
        messageName: "Festival mantra",
        searchableFields: ["name", "displayName", "mantraCode", "mantra", "meaning"],
        uniqueField: "mantraCode",
      },
      relationValidation,
    );
  }
}
