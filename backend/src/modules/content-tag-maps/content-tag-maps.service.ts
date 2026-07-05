import { Injectable } from "@nestjs/common";
import { ContentTagMap } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentItemChildCrudService } from "../content-item-child-common/content-item-child-crud.service";

@Injectable()
export class ContentTagMapsService extends ContentItemChildCrudService<ContentTagMap> {
  constructor(
    prisma: PrismaService,
    private readonly relationValidationService: RelationValidationService,
  ) {
    super(
      prisma.contentTagMap,
      {
        allowedFilterFields: ["tagId"],
        allowedSortFields: ["tagId", "createdAt"],
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Content tag map",
        searchableFields: [],
        uniqueField: "tagId",
      },
      relationValidationService,
    );
  }

  protected async validateChildRelations(data: Record<string, unknown>) {
    const tagId = typeof data.tagId === "string" ? data.tagId : undefined;
    if (tagId) {
      await this.relationValidationService.validateForeignKeys({ contentTagId: tagId });
    }
    return undefined;
  }
}
