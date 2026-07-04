import { Injectable } from "@nestjs/common";
import { FestivalPujaVidhi } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalPujaVidhisService extends FestivalChildCrudService<FestivalPujaVidhi> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalPujaVidhi,
      {
        allowedSortFields: ["stepOrder", "name", "displayName"],
        messageName: "Festival puja vidhi",
        searchableFields: ["name", "displayName", "vidhiCode", "description"],
        uniqueField: "vidhiCode",
      },
      relationValidation,
    );
  }
}
