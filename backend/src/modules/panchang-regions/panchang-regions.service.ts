import { Injectable, NotFoundException } from "@nestjs/common";
import { PanchangRegion } from "@prisma/client";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PanchangChildCrudService } from "../panchang-child-common/panchang-child-crud.service";

@Injectable()
export class PanchangRegionsService extends PanchangChildCrudService<PanchangRegion> {
  private readonly locationValidator: RelationValidationService;

  constructor(
    private readonly prisma: PrismaService,
    relationValidation: RelationValidationService,
  ) {
    super(
      prisma.panchangRegion,
      {
        allowedFilterFields: ["countryId", "stateId", "cityId"],
        allowedSortFields: ["regionName"],
        hasSoftDelete: false,
        hasSortOrder: false,
        messageName: "Panchang region",
        searchableFields: ["regionName"],
      },
      relationValidation,
    );
    this.locationValidator = relationValidation;
  }

  async createChild(panchangId: string, data: object, actorId: string) {
    await this.validateLocation(data as Record<string, unknown>);
    return super.createChild(panchangId, data, actorId);
  }

  async updateChild(panchangId: string, id: string, data: object, actorId: string) {
    const payload = data as Record<string, unknown>;
    const existing = await this.prisma.panchangRegion.findFirst({
      where: { id, panchangId },
    });

    if (!existing) {
      throw new NotFoundException("Panchang region not found");
    }

    await this.validateLocation({
      countryId: payload.countryId ?? existing.countryId,
      stateId: payload.stateId ?? existing.stateId,
      cityId: payload.cityId ?? existing.cityId,
    });
    return super.updateChild(panchangId, id, data, actorId);
  }

  private async validateLocation(data: Record<string, unknown>) {
    const countryId = typeof data.countryId === "string" ? data.countryId : undefined;
    const stateId = typeof data.stateId === "string" ? data.stateId : undefined;
    const cityId = typeof data.cityId === "string" ? data.cityId : undefined;

    await this.locationValidator.validateForeignKeys({ cityId, countryId, stateId });
    if (countryId && stateId) {
      await this.locationValidator.validateStateHierarchy(countryId, stateId);
    }
    if (stateId && cityId) {
      await this.locationValidator.validateCityHierarchy(stateId, cityId, countryId);
    }
  }
}
