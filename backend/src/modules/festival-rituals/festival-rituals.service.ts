import { Injectable } from "@nestjs/common";
import { FestivalRitual } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalRitualsService extends FestivalChildCrudService<FestivalRitual> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalRitual,
      {
        allowedFilterFields: ["ritualType"],
        allowedSortFields: ["ritualType", "name", "displayName"],
        messageName: "Festival ritual",
        searchableFields: ["name", "displayName", "ritualCode", "description", "ritualType"],
        uniqueField: "ritualCode",
      },
      relationValidation,
    );
  }
}
