import { Injectable } from "@nestjs/common";
import { ContentTranslation } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentChildCrudService } from "../content-child-common/content-child-crud.service";

@Injectable()
export class ContentTranslationsService extends ContentChildCrudService<ContentTranslation> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.contentTranslation,
      {
        allowedFilterFields: ["language"],
        allowedSortFields: ["language", "title"],
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Content translation",
        searchableFields: ["title", "body", "metaTitle", "metaDescription"],
        uniqueField: "language",
      },
      relationValidation,
    );
  }
}
