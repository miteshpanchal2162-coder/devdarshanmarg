import { Injectable } from "@nestjs/common";
import { TempleAccessibility } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleAccessibilityService extends TempleChildCrudService<TempleAccessibility> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeAccessibility, {
      messageName: "Temple accessibility",
      searchableFields: ["accessibilityCode", "feature", "description"],
      uniqueField: "accessibilityCode",
    }, relationValidation);
  }
}
