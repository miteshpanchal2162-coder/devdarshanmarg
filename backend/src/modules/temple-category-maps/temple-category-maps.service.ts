import { Injectable } from "@nestjs/common";
import { TempleCategoryMap } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleCategoryMapsService extends TempleChildCrudService<TempleCategoryMap> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeCategoryMap,
      {
        allowedFilterFields: ["categoryId"],
        allowedSortFields: ["categoryId"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Temple category map",
        searchableFields: [],
        uniqueField: "categoryId",
      },
      relationValidation,
    );
  }
}
