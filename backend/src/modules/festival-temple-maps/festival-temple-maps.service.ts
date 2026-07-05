import { Injectable, NotFoundException } from "@nestjs/common";
import { FestivalTempleMap } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";
import { CreateFestivalTempleMapDto, UpdateFestivalTempleMapDto } from "./dto/festival-temple-map.dto";

@Injectable()
export class FestivalTempleMapsService extends FestivalChildCrudService<FestivalTempleMap> {
  private readonly relationValidator: RelationValidationService;

  constructor(
    private readonly prisma: PrismaService,
    relationValidation: RelationValidationService,
  ) {
    super(
      prisma.festivalTempleMap,
      {
        allowedFilterFields: ["templeId", "highlight"],
        allowedSortFields: ["templeId", "highlight"],
        hasSoftDelete: false,
        hasStatus: false,
        messageName: "Festival temple map",
        searchableFields: [],
        uniqueField: "templeId",
      },
      relationValidation,
    );
    this.relationValidator = relationValidation;
  }

  async createChild(festivalId: string, data: CreateFestivalTempleMapDto, actorId: string) {
    await this.relationValidator.validateForeignKeys({ templeId: data.templeId });
    return super.createChild(festivalId, data, actorId);
  }

  async updateChild(festivalId: string, id: string, data: UpdateFestivalTempleMapDto, actorId: string) {
    if (data.templeId) {
      await this.relationValidator.validateForeignKeys({ templeId: data.templeId });
    }

    const existing = await this.prisma.festivalTempleMap.findFirst({
      where: { id, festivalId },
    });

    if (!existing) {
      throw new NotFoundException("Festival temple map not found");
    }

    return super.updateChild(festivalId, id, data, actorId);
  }
}
