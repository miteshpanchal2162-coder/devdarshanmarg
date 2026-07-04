import { Injectable } from "@nestjs/common";
import { TempleRoute } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleRoutesService extends TempleChildCrudService<TempleRoute> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeRoute, {
      messageName: "Temple route",
      searchableFields: ["routeCode", "routeName", "routeType", "startingPoint", "destination", "transportMode"],
      uniqueField: "routeCode",
    }, relationValidation);
  }
}
