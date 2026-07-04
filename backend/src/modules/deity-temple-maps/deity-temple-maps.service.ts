import { Injectable } from "@nestjs/common";
import { TempleDeityMap } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityTempleMapsService extends DeityChildCrudService<TempleDeityMap> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeDeityMap,
      {
        allowedFilterFields: ["templeId", "isPrimary"],
        allowedSortFields: ["templeId", "isPrimary"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Deity temple map",
        searchableFields: [],
        uniqueField: "templeId",
      },
      relationValidation,
    );
  }
}
