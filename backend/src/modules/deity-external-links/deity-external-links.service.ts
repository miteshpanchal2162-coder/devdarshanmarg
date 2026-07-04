import { Injectable } from "@nestjs/common";
import { DeityExternalLink } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityExternalLinksService extends DeityChildCrudService<DeityExternalLink> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityExternalLink,
      {
        allowedFilterFields: ["linkType", "isOfficial"],
        allowedSortFields: ["linkType", "isOfficial", "title"],
        messageName: "Deity external link",
        searchableFields: ["linkCode", "title", "linkType", "url"],
        uniqueField: "linkCode",
      },
      relationValidation,
    );
  }
}
