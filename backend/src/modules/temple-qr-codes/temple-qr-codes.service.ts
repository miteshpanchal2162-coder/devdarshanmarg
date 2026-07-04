import { Injectable } from "@nestjs/common";
import { TempleQrCode } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleQrCodesService extends TempleChildCrudService<TempleQrCode> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeQrCode,
      {
        allowedFilterFields: ["qrType"],
        allowedSortFields: ["qrType"],
        messageName: "Temple QR code",
        searchableFields: ["title", "qrType", "targetUrl"],
      },
      relationValidation,
    );
  }
}
