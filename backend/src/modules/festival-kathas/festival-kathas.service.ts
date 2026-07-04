import { Injectable } from "@nestjs/common";
import { FestivalKatha } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalKathasService extends FestivalChildCrudService<FestivalKatha> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalKatha,
      {
        allowedFilterFields: ["languageId"],
        allowedSortFields: ["languageId", "name", "displayName", "narrator"],
        messageName: "Festival katha",
        searchableFields: ["name", "displayName", "kathaCode", "description", "content", "narrator"],
        uniqueField: "kathaCode",
      },
      relationValidation,
    );
  }
}
