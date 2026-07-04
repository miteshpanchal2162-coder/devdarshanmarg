import { Injectable } from "@nestjs/common";
import { TempleFacility } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleFacilitiesService extends TempleChildCrudService<TempleFacility> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeFacility, {
      messageName: "Temple facility",
      searchableFields: ["facilityCode", "name", "displayName", "category", "description"],
      uniqueField: "facilityCode",
    }, relationValidation);
  }
}
