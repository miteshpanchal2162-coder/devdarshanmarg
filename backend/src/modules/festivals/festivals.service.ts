import { ConflictException, Injectable } from "@nestjs/common";
import { Festival, Status } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateFestivalDto, FestivalQueryDto, UpdateFestivalDto } from "./dto/festival.dto";

type FestivalResponse = Omit<Festival, "deletedAt">;

@Injectable()
export class FestivalsService extends BaseCrudService<Festival> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.festival,
      ["name", "displayName", "slug", "festivalCode", "alternateNames", "searchKeywords", "metaTitle", "festivalType"],
      [
        "name",
        "displayName",
        "slug",
        "festivalCode",
        "festivalType",
        "importanceLevel",
        "isFeatured",
        "isPopular",
        "isNational",
        "isRegional",
        "isInternational",
        "isPublicHoliday",
        "sortOrder",
        "status",
        "createdAt",
        "updatedAt",
      ],
      [
        "status",
        "festivalType",
        "isFeatured",
        "isPopular",
        "isNational",
        "isRegional",
        "isInternational",
        "isPublicHoliday",
      ],
    );
  }

  async findAll(query: FestivalQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse("Festival fetched successfully", this.toResponse(await super.findOne(id)));
  }

  async createFestival(dto: CreateFestivalDto, actorId: string) {
    await this.ensureUnique(dto.slug, dto.festivalCode);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      importanceLevel: dto.importanceLevel ?? 1,
      isNational: dto.isNational ?? false,
      isRegional: dto.isRegional ?? false,
      isInternational: dto.isInternational ?? false,
      isPublicHoliday: dto.isPublicHoliday ?? false,
      isFeatured: dto.isFeatured ?? false,
      isPopular: dto.isPopular ?? false,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Festival created successfully", this.toResponse(item));
  }

  async updateFestival(id: string, dto: UpdateFestivalDto, actorId: string) {
    if (dto.slug || dto.festivalCode) {
      await this.ensureUnique(dto.slug, dto.festivalCode, id);
    }
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Festival updated successfully", this.toResponse(item));
  }

  async deleteFestival(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Festival deleted successfully", this.toResponse(item));
  }

  async restoreFestival(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Festival restored successfully", this.toResponse(item));
  }

  async updateFestivalStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Festival status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(slug?: string, festivalCode?: string, excludeId?: string) {
    if (!slug && !festivalCode) return;
    const existing = await this.prisma.festival.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(slug ? [{ slug }] : []),
          ...(festivalCode ? [{ festivalCode }] : []),
        ],
      },
    });
    if (existing) throw new ConflictException("Festival slug or code already exists");
  }

  private toResponse(item: Festival): FestivalResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}
