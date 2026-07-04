import { Injectable } from "@nestjs/common";
import { TempleLiveDarshan } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleLiveDarshanService extends TempleChildCrudService<TempleLiveDarshan> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeLiveDarshan,
      {
        allowedFilterFields: ["provider", "isLive"],
        allowedSortFields: ["provider", "priority"],
        messageName: "Temple live darshan",
        searchableFields: ["title", "provider", "streamUrl", "embedUrl"],
      },
      relationValidation,
    );
  }
}
