import { Injectable } from "@nestjs/common";
import { TempleParking } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleParkingService extends TempleChildCrudService<TempleParking> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeParking, {
      messageName: "Temple parking",
      searchableFields: ["parkingCode", "parkingType", "description"],
      uniqueField: "parkingCode",
    }, relationValidation);
  }
}
