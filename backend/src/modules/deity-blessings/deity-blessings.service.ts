import { Injectable } from "@nestjs/common";
import { DeityBlessing } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityBlessingsService extends DeityChildCrudService<DeityBlessing> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityBlessing,
      {
        allowedSortFields: ["blessingCode", "title"],
        messageName: "Deity blessing",
        searchableFields: ["blessingCode", "title", "description"],
        uniqueField: "blessingCode",
      },
      relationValidation,
    );
  }
}
