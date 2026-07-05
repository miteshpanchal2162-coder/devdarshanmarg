import { Injectable } from "@nestjs/common";
import { ContentItemTranslation } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentItemChildCrudService } from "../content-item-child-common/content-item-child-crud.service";

@Injectable()
export class ContentItemTranslationsService extends ContentItemChildCrudService<ContentItemTranslation> {
  constructor(
    prisma: PrismaService,
    private readonly relationValidationService: RelationValidationService,
  ) {
    super(
      prisma.contentItemTranslation,
      {
        allowedFilterFields: ["languageId"],
        allowedSortFields: ["languageId", "title", "subtitle"],
        hasAuditFields: false,
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Content item translation",
        searchableFields: ["title", "subtitle", "body", "transliteration", "meaning"],
        uniqueField: "languageId",
      },
      relationValidationService,
    );
  }

  protected async validateChildRelations(data: Record<string, unknown>) {
    const languageId = typeof data.languageId === "string" ? data.languageId : undefined;
    if (languageId) {
      await this.relationValidationService.validateForeignKeys({ languageId });
    }
    return undefined;
  }
}
