import { Injectable } from "@nestjs/common";
import { FestivalVideo } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";

@Injectable()
export class FestivalVideosService extends FestivalChildCrudService<FestivalVideo> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.festivalVideo,
      {
        allowedFilterFields: ["mediaTypeId", "languageId", "isFeatured"],
        allowedSortFields: ["mediaTypeId", "languageId", "title", "durationSeconds"],
        messageName: "Festival video",
        searchableFields: ["title", "videoCode", "description"],
        uniqueField: "videoCode",
      },
      relationValidation,
    );
  }
}
