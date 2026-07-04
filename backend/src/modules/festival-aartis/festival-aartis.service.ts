import { Injectable } from "@nestjs/common";
import { FestivalAarti } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalAartisService extends FestivalChildCrudService<FestivalAarti> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalAarti,
      {
        allowedFilterFields: ["languageId"],
        allowedSortFields: ["languageId", "name", "displayName"],
        messageName: "Festival aarti",
        searchableFields: ["name", "displayName", "aartiCode", "lyrics"],
        uniqueField: "aartiCode",
      },
      relationValidation,
    );
  }
}
