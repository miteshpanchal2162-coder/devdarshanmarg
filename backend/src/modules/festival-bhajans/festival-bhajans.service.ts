import { Injectable } from "@nestjs/common";
import { FestivalBhajan } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalBhajansService extends FestivalChildCrudService<FestivalBhajan> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalBhajan,
      {
        allowedFilterFields: ["languageId", "raga"],
        allowedSortFields: ["languageId", "name", "displayName", "composer", "raga"],
        messageName: "Festival bhajan",
        searchableFields: ["name", "displayName", "bhajanCode", "lyrics", "composer", "raga"],
        uniqueField: "bhajanCode",
      },
      relationValidation,
    );
  }
}
