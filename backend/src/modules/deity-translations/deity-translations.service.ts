import { Injectable } from "@nestjs/common";
import { DeityTranslation } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityTranslationsService extends DeityChildCrudService<DeityTranslation> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityTranslation,
      {
        allowedFilterFields: ["language"],
        allowedSortFields: ["language", "name"],
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Deity translation",
        searchableFields: ["name", "description", "metaTitle", "metaDescription"],
        uniqueField: "language",
      },
      relationValidation,
    );
  }
}
