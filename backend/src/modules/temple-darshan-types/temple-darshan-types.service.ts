import { Injectable } from "@nestjs/common";
import { TempleDarshanType } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleDarshanTypesService extends TempleChildCrudService<TempleDarshanType> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeDarshanType, {
      messageName: "Temple darshan type",
      searchableFields: ["name", "darshanCode", "description", "recommendedFor"],
      uniqueField: "darshanCode",
    }, relationValidation);
  }
}
