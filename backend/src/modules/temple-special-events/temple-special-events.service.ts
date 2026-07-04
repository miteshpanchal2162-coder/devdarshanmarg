import { Injectable } from "@nestjs/common";
import { TempleSpecialEvent } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleSpecialEventsService extends TempleChildCrudService<TempleSpecialEvent> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeSpecialEvent, {
      messageName: "Temple special event",
      searchableFields: ["title", "eventCode", "description", "searchKeywords"],
      uniqueField: "eventCode",
    }, relationValidation);
  }
}
