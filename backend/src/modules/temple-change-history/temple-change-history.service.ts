import { Injectable } from "@nestjs/common";
import { TempleChangeHistory } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleChangeHistoryService extends TempleChildCrudService<TempleChangeHistory> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeChangeHistory,
      {
        allowedFilterFields: ["userId", "action", "fieldName"],
        allowedSortFields: ["userId", "action", "fieldName"],
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Temple change history",
        searchableFields: ["action", "fieldName", "oldValue", "newValue", "ipAddress", "userAgent"],
      },
      relationValidation,
    );
  }
}
