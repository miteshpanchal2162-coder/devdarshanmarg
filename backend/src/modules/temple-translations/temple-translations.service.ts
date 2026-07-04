import { Injectable } from "@nestjs/common";
import { TempleTranslation } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleTranslationsService extends TempleChildCrudService<TempleTranslation> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeTranslation,
      {
        allowedFilterFields: ["language"],
        allowedSortFields: ["language", "name"],
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Temple translation",
        searchableFields: ["name", "shortDescription", "description", "history", "significance", "address", "metaTitle", "metaDescription", "metaKeywords"],
        uniqueField: "language",
      },
      relationValidation,
    );
  }
}
