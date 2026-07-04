import { Injectable } from "@nestjs/common";
import { DeityStotra } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityStotrasService extends DeityChildCrudService<DeityStotra> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityStotra,
      {
        allowedFilterFields: ["languageId"],
        allowedSortFields: ["languageId", "name", "displayName"],
        messageName: "Deity stotra",
        searchableFields: ["name", "displayName", "stotraCode", "content", "composer"],
        uniqueField: "stotraCode",
      },
      relationValidation,
    );
  }
}
