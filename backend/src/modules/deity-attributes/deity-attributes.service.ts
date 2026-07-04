import { Injectable } from "@nestjs/common";
import { DeityAttribute } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityAttributesService extends DeityChildCrudService<DeityAttribute> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityAttribute,
      {
        allowedSortFields: ["attributeCode", "attributeName"],
        messageName: "Deity attribute",
        searchableFields: ["attributeCode", "attributeName", "attributeValue", "description"],
        uniqueField: "attributeCode",
      },
      relationValidation,
    );
  }
}
