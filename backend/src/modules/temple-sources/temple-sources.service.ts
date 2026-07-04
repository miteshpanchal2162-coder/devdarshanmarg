import { Injectable } from "@nestjs/common";
import { TempleSource } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleSourcesService extends TempleChildCrudService<TempleSource> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeSource, {
      messageName: "Temple source",
      searchableFields: ["sourceCode", "title", "sourceType", "author", "publisher", "isbn", "citation"],
      uniqueField: "sourceCode",
    }, relationValidation);
  }
}
