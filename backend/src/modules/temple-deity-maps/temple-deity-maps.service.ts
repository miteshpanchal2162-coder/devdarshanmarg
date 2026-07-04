import { Injectable } from "@nestjs/common";
import { TempleDeityMap } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleDeityMapsService extends TempleChildCrudService<TempleDeityMap> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeDeityMap,
      {
        allowedFilterFields: ["deityId", "isPrimary"],
        allowedSortFields: ["deityId", "isPrimary"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Temple deity map",
        searchableFields: [],
        uniqueField: "deityId",
      },
      relationValidation,
    );
  }
}
