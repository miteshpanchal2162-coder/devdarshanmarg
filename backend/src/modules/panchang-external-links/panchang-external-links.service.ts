import { Injectable } from "@nestjs/common";
import { PanchangExternalLink } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangChildCrudService } from "../panchang-child-common/panchang-child-crud.service";

@Injectable()
export class PanchangExternalLinksService extends PanchangChildCrudService<PanchangExternalLink> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.panchangExternalLink,
      {
        allowedFilterFields: ["linkType", "isOfficial"],
        allowedSortFields: ["linkType", "isOfficial", "title"],
        messageName: "Panchang external link",
        searchableFields: ["linkCode", "title", "linkType", "url"],
        uniqueField: "linkCode",
      },
      relationValidation,
    );
  }
}
