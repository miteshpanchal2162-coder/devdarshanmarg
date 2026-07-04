import { ConflictException, Injectable } from "@nestjs/common";
import { Panchang, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreatePanchangDto, PanchangQueryDto, UpdatePanchangDto } from "./dto/panchang.dto";

type PanchangResponse = Omit<Panchang, "deletedAt">;

@Injectable()
export class PanchangsService extends BaseCrudService<Panchang> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.panchang,
      ["name", "slug", "panchangCode", "description", "calendarType", "timezone"],
      [
        "name",
        "slug",
        "panchangCode",
        "calendarType",
        "timezone",
        "countryId",
        "stateId",
        "isDefault",
        "sortOrder",
        "status",
        "createdAt",
        "updatedAt",
      ],
      ["status", "countryId", "stateId", "isDefault"],
    );
  }

  async findAll(query: PanchangQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Panchang fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createPanchang(dto: CreatePanchangDto, actorId: string) {
    await this.validateLocation(dto.countryId, dto.stateId);
    await this.ensureUnique(dto.slug, dto.panchangCode);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      isDefault: dto.isDefault ?? false,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Panchang created successfully", this.toResponse(item));
  }

  async updatePanchang(id: string, dto: UpdatePanchangDto, actorId: string) {
    await this.validateLocation(dto.countryId, dto.stateId);
    if (dto.slug || dto.panchangCode) {
      await this.ensureUnique(dto.slug, dto.panchangCode, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Panchang updated successfully", this.toResponse(item));
  }

  async deletePanchang(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Panchang deleted successfully", this.toResponse(item));
  }

  async restorePanchang(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Panchang restored successfully", this.toResponse(item));
  }

  async updatePanchangStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Panchang status updated successfully", this.toResponse(item));
  }

  private async validateLocation(countryId?: string, stateId?: string) {
    await this.relationValidation.validateForeignKeys({ countryId, stateId });
    if (countryId && stateId) {
      await this.relationValidation.validateStateHierarchy(countryId, stateId);
    }
  }

  private async ensureUnique(slug?: string, panchangCode?: string, excludeId?: string) {
    if (!slug && !panchangCode) return;
    const existing = await this.prisma.panchang.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(slug ? [{ slug }] : []),
          ...(panchangCode ? [{ panchangCode }] : []),
        ],
      },
    });
    if (existing) {
      throw new ConflictException("Panchang slug or code already exists");
    }
  }

  private toResponse(item: Panchang): PanchangResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}
