import { Injectable } from "@nestjs/common";
import { TemplePooja } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TemplePoojasService extends TempleChildCrudService<TemplePooja> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templePooja, {
      messageName: "Temple pooja",
      searchableFields: ["name", "displayName", "poojaCode", "description", "searchKeywords"],
      uniqueField: "poojaCode",
    }, relationValidation);
  }
}
