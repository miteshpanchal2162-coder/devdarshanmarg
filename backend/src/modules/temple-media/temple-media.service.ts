import { Injectable } from "@nestjs/common";
import { TempleMedia } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TempleChildCrudService } from "../temple-child-common/temple-child-crud.service";

@Injectable()
export class TempleMediaService extends TempleChildCrudService<TempleMedia> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.templeMedia,
      {
        messageName: "Temple media",
        searchableFields: ["title", "caption", "altText", "photographer"],
      },
      relationValidation,
    );
  }
}
