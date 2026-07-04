import { Injectable } from "@nestjs/common";
import { FestivalDeityMap } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityFestivalsService extends DeityChildCrudService<FestivalDeityMap> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalDeityMap,
      {
        allowedFilterFields: ["festivalId", "primaryDeity"],
        allowedSortFields: ["festivalId", "primaryDeity"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Deity festival map",
        searchableFields: [],
        uniqueField: "festivalId",
      },
      relationValidation,
    );
  }
}
