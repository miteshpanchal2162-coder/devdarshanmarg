import { Injectable } from "@nestjs/common";
import { DeityAssociation } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityAssociationsService extends DeityChildCrudService<DeityAssociation> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityAssociation,
      {
        allowedFilterFields: ["associationType"],
        allowedSortFields: ["associationType", "associationName"],
        messageName: "Deity association",
        searchableFields: ["associationType", "associationName", "description"],
      },
      relationValidation,
    );
  }
}
