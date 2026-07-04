import { Injectable } from "@nestjs/common";
import { PanchangSource } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangChildCrudService } from "../panchang-child-common/panchang-child-crud.service";

@Injectable()
export class PanchangSourcesService extends PanchangChildCrudService<PanchangSource> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.panchangSource,
      {
        allowedFilterFields: ["languageId"],
        allowedSortFields: ["sourceCode", "title", "author", "publisher"],
        messageName: "Panchang source",
        searchableFields: ["sourceCode", "title", "author", "publisher", "citation"],
        uniqueField: "sourceCode",
      },
      relationValidation,
    );
  }
}
