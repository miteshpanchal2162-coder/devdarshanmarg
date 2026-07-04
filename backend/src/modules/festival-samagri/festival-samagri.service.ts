import { Injectable } from "@nestjs/common";
import { FestivalSamagri } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalSamagriService extends FestivalChildCrudService<FestivalSamagri> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalSamagri,
      {
        allowedFilterFields: ["isEssential", "unit"],
        allowedSortFields: ["name", "displayName"],
        messageName: "Festival samagri",
        searchableFields: ["name", "displayName", "samagriCode", "description"],
        uniqueField: "samagriCode",
      },
      relationValidation,
    );
  }
}
