import { Injectable } from "@nestjs/common";
import { PanchangTranslation } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangChildCrudService } from "../panchang-child-common/panchang-child-crud.service";

@Injectable()
export class PanchangTranslationsService extends PanchangChildCrudService<PanchangTranslation> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.panchangTranslation,
      {
        allowedFilterFields: ["language"],
        allowedSortFields: ["language", "name"],
        hasSoftDelete: false,
        hasSortOrder: false,
        hasStatus: false,
        messageName: "Panchang translation",
        searchableFields: ["name", "description", "metaTitle", "metaDescription"],
        uniqueField: "language",
      },
      relationValidation,
    );
  }
}
