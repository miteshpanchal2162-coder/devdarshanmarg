import { Injectable } from "@nestjs/common";
import { TempleAarti } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleAartisService extends TempleChildCrudService<TempleAarti> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeAarti, {
      messageName: "Temple aarti",
      searchableFields: ["name", "displayName", "description", "searchKeywords"],
    }, relationValidation);
  }
}
