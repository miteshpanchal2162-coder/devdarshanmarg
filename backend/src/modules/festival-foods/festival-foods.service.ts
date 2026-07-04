import { Injectable } from "@nestjs/common";
import { FestivalFood } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalFoodsService extends FestivalChildCrudService<FestivalFood> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalFood,
      {
        allowedFilterFields: ["foodType", "isVegetarian"],
        allowedSortFields: ["foodType", "name", "displayName"],
        messageName: "Festival food",
        searchableFields: ["name", "displayName", "foodCode", "description", "foodType"],
        uniqueField: "foodCode",
      },
      relationValidation,
    );
  }
}
