import { Injectable, NotFoundException } from "@nestjs/common";
import { FestivalRegion } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FestivalChildCrudService } from "../festival-child-common/festival-child-crud.service";
import { CreateFestivalRegionDto, UpdateFestivalRegionDto } from "./dto/festival-region.dto";

@Injectable()
export class FestivalRegionsService extends FestivalChildCrudService<FestivalRegion> {
  private readonly locationValidator: RelationValidationService;

  constructor(
    private readonly prisma: PrismaService,
    relationValidation: RelationValidationService,
  ) {
    super(
      prisma.festivalRegion,
      {
        allowedFilterFields: ["countryId", "stateId", "cityId", "importance"],
        allowedSortFields: ["countryId", "stateId", "cityId", "importance"],
        messageName: "Festival region",
        searchableFields: ["importance", "description"],
      },
      relationValidation,
    );
    this.locationValidator = relationValidation;
  }

  async createChild(festivalId: string, data: CreateFestivalRegionDto, actorId: string) {
    await this.validateGeo(data);
    return super.createChild(festivalId, data, actorId);
  }

  async updateChild(festivalId: string, id: string, data: UpdateFestivalRegionDto, actorId: string) {
    const existing = await this.prisma.festivalRegion.findFirst({
      where: { id, festivalId },
    });

    if (!existing) {
      throw new NotFoundException("Festival region not found");
    }

    await this.validateGeo({
      countryId: data.countryId ?? existing.countryId,
      stateId: data.stateId ?? existing.stateId,
      cityId: data.cityId ?? existing.cityId,
    });
    return super.updateChild(festivalId, id, data, actorId);
  }

  private async validateGeo(input: {
    cityId?: string | null;
    countryId?: string | null;
    stateId?: string | null;
  }) {
    const countryId = input.countryId ?? undefined;
    const stateId = input.stateId ?? undefined;
    const cityId = input.cityId ?? undefined;

    await this.locationValidator.validateForeignKeys({ cityId, countryId, stateId });

    if (countryId && stateId) {
      await this.locationValidator.validateStateHierarchy(countryId, stateId);
    }

    if (stateId && cityId) {
      await this.locationValidator.validateCityHierarchy(stateId, cityId, countryId);
    }
  }
}
