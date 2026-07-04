import { Injectable } from "@nestjs/common";
import { TempleDonation } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleDonationsService extends TempleChildCrudService<TempleDonation> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeDonation,
      {
        allowedFilterFields: ["donationType", "currency", "receiptAvailable", "taxBenefit"],
        allowedSortFields: ["donationType", "minimumAmount", "maximumAmount", "currency"],
        messageName: "Temple donation",
        searchableFields: ["donationType", "title", "description", "currency", "paymentUrl", "upiId"],
      },
      relationValidation,
    );
  }
}
