import { Injectable } from "@nestjs/common";
import { FestivalCategoryMap } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalCategoryMapsService extends FestivalChildCrudService<FestivalCategoryMap> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalCategoryMap,
      {
        allowedFilterFields: ["categoryId"],
        allowedSortFields: ["categoryId"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Festival category map",
        searchableFields: [],
        uniqueField: "categoryId",
      },
      relationValidation,
    );
  }
}
