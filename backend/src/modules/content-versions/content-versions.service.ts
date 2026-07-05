import { Injectable } from "@nestjs/common";
import { ContentVersion } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentItemChildCrudService } from "../content-item-child-common/content-item-child-crud.service";

@Injectable()
export class ContentVersionsService extends ContentItemChildCrudService<ContentVersion> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.contentVersion,
      {
        allowedFilterFields: ["versionNumber", "createdBy"],
        allowedSortFields: ["versionNumber", "title", "createdAt"],
        hasAuditFields: true,
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Content version",
        searchableFields: ["title", "body", "changeSummary"],
        uniqueField: "versionNumber",
      },
      relationValidation,
    );
  }
}
