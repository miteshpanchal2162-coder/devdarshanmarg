import { Injectable } from "@nestjs/common";
import { TempleNearbyPlace } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleNearbyPlacesService extends TempleChildCrudService<TempleNearbyPlace> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeNearbyPlace, {
      messageName: "Temple nearby place",
      searchableFields: ["placeCode", "name", "placeType", "description", "phone"],
      uniqueField: "placeCode",
    }, relationValidation);
  }
}
