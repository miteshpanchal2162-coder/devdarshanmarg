import { Injectable } from "@nestjs/common";
import { FestivalTranslation } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalTranslationsService extends FestivalChildCrudService<FestivalTranslation> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalTranslation,
      {
        allowedFilterFields: ["language"],
        allowedSortFields: ["language", "name"],
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Festival translation",
        searchableFields: ["name", "description", "metaTitle", "metaDescription"],
        uniqueField: "language",
      },
      relationValidation,
    );
  }
}
