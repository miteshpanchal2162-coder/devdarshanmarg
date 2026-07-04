import { Injectable } from "@nestjs/common";
import { DeityStory } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityStoriesService extends DeityChildCrudService<DeityStory> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityStory,
      {
        allowedFilterFields: ["languageId"],
        allowedSortFields: ["languageId", "name", "displayName"],
        messageName: "Deity story",
        searchableFields: ["name", "displayName", "storyCode", "description", "content", "narrator"],
        uniqueField: "storyCode",
      },
      relationValidation,
    );
  }
}
