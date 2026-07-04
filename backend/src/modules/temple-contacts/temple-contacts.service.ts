import { Injectable } from "@nestjs/common";
import { TempleContact } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleContactsService extends TempleChildCrudService<TempleContact> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(prisma.templeContact, {
      messageName: "Temple contact",
      searchableFields: ["contactCode", "contactType", "personName", "designation", "phone", "email", "department"],
      uniqueField: "contactCode",
    }, relationValidation);
  }
}
