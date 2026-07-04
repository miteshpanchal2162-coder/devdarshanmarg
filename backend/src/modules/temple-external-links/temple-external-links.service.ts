import { Injectable } from "@nestjs/common";
import { TempleExternalLink } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleExternalLinksService extends TempleChildCrudService<TempleExternalLink> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeExternalLink,
      {
        allowedFilterFields: ["linkType", "isOfficial"],
        allowedSortFields: ["linkType", "isOfficial"],
        messageName: "Temple external link",
        searchableFields: ["title", "linkType", "url", "icon"],
      },
      relationValidation,
    );
  }
}
