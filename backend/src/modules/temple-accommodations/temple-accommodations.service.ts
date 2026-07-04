import { Injectable } from "@nestjs/common";
import { TempleAccommodation } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleAccommodationsService extends TempleChildCrudService<TempleAccommodation> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeAccommodation, {
      messageName: "Temple accommodation",
      searchableFields: ["accommodationCode", "name", "accommodationType", "phone", "email", "description"],
      uniqueField: "accommodationCode",
    }, relationValidation);
  }
}
