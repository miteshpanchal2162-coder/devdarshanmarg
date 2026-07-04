import { Injectable } from "@nestjs/common";
import { DeityCategoryMap } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityCategoryMapsService extends DeityChildCrudService<DeityCategoryMap> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityCategoryMap,
      {
        allowedFilterFields: ["categoryId"],
        allowedSortFields: ["categoryId"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Deity category map",
        searchableFields: [],
        uniqueField: "categoryId",
      },
      relationValidation,
    );
  }
}
