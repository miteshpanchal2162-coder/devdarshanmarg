import { Injectable } from "@nestjs/common";
import { DeityAvatar } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { DeityChildCrudService } from "../deity-child-common/deity-child-crud.service";

@Injectable()
export class DeityAvatarsService extends DeityChildCrudService<DeityAvatar> {
  constructor(prisma: PrismaService, relationValidation: RelationValidationService) {
    super(
      prisma.deityAvatar,
      {
        allowedFilterFields: ["featured", "avatarOrder"],
        allowedSortFields: ["avatarCode", "avatarName", "avatarOrder", "featured"],
        messageName: "Deity avatar",
        searchableFields: ["avatarCode", "avatarName", "description", "alternateName"],
        uniqueField: "avatarCode",
      },
      relationValidation,
    );
  }
}
