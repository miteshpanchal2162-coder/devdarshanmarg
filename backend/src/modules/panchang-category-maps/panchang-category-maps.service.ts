import { Injectable } from "@nestjs/common";
import { PanchangCategoryMap } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangChildCrudService } from "../panchang-child-common/panchang-child-crud.service";

@Injectable()
export class PanchangCategoryMapsService extends PanchangChildCrudService<PanchangCategoryMap> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.panchangCategoryMap,
      {
        allowedFilterFields: ["categoryId"],
        allowedSortFields: ["categoryId"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Panchang category map",
        searchableFields: [],
        uniqueField: "categoryId",
      },
      relationValidation,
    );
  }
}
