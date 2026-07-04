import { Injectable } from "@nestjs/common";
import { DeityAarti } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityAartisService extends DeityChildCrudService<DeityAarti> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityAarti,
      {
        allowedFilterFields: ["languageId"],
        allowedSortFields: ["languageId", "name", "displayName"],
        messageName: "Deity aarti",
        searchableFields: ["name", "displayName", "aartiCode", "lyrics"],
        uniqueField: "aartiCode",
      },
      relationValidation,
    );
  }
}
