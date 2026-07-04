import { Injectable } from "@nestjs/common";
import { TempleTiming } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleTimingsService extends TempleChildCrudService<TempleTiming> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeTiming,
      {
        allowedFilterFields: ["dayOfWeek", "isClosed", "isFestivalTiming"],
        allowedSortFields: ["dayOfWeek", "effectiveFrom", "effectiveTo"],
        messageName: "Temple timing",
        searchableFields: ["specialNote", "remarks"],
      },
      relationValidation,
    );
  }
}
