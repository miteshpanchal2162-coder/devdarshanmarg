import { Injectable } from "@nestjs/common";
import { TemplePrasadam } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TemplePrasadamsService extends TempleChildCrudService<TemplePrasadam> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templePrasadam, {
      messageName: "Temple prasadam",
      searchableFields: ["prasadamCode", "name", "description", "ingredients", "shelfLife"],
      uniqueField: "prasadamCode",
    }, relationValidation);
  }
}
