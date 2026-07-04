import { Injectable } from "@nestjs/common";
import { DeityChangeHistory } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityChangeHistoryService extends DeityChildCrudService<DeityChangeHistory> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityChangeHistory,
      {
        allowedFilterFields: ["userId", "action"],
        allowedSortFields: ["userId", "action", "createdAt"],
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Deity change history",
        searchableFields: ["action", "remarks"],
      },
      relationValidation,
    );
  }
}
