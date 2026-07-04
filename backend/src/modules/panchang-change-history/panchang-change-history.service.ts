import { Injectable } from "@nestjs/common";
import { PanchangChangeHistory } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangChildCrudService } from "../panchang-child-common/panchang-child-crud.service";

@Injectable()
export class PanchangChangeHistoryService extends PanchangChildCrudService<PanchangChangeHistory> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.panchangChangeHistory,
      {
        allowedFilterFields: ["userId", "action"],
        allowedSortFields: ["userId", "action", "createdAt"],
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Panchang change history",
        searchableFields: ["action", "remarks"],
      },
      relationValidation,
    );
  }
}
