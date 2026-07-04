import { Injectable } from "@nestjs/common";
import { TemplePilgrimTip } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TemplePilgrimTipsService extends TempleChildCrudService<TemplePilgrimTip> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templePilgrimTip,
      {
        allowedFilterFields: ["language"],
        allowedSortFields: ["language"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Temple pilgrim tip",
        searchableFields: ["tip"],
      },
      relationValidation,
    );
  }
}
