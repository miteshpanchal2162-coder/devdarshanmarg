import { ConflictException, Injectable } from "@nestjs/common";
import { Status, SupportedLanguage } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import {
  CreateSupportedLanguageDto,
  SupportedLanguageQueryDto,
  UpdateSupportedLanguageDto,
} from "./dto/supported-language.dto";

type SupportedLanguageResponse = Omit<SupportedLanguage, "deletedAt">;

@Injectable()
export class SupportedLanguagesService extends BaseCrudService<SupportedLanguage> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.supportedLanguage,
      ["name", "nativeName", "isoCode", "locale", "direction", "fontFamily"],
      ["name", "nativeName", "isoCode", "locale", "sortOrder", "status", "createdAt", "updatedAt"],
      ["status", "isoCode", "locale", "isDefault", "isRtl"],
    );
  }

  async findAll(query: SupportedLanguageQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(
      result.items.map((item) => this.toResponse(item)),
      result.meta,
    );
  }

  async findById(id: string) {
    return createApiResponse(
      "Supported language fetched successfully",
      this.toResponse(await super.findOne(id)),
    );
  }

  async createLanguage(dto: CreateSupportedLanguageDto, actorId: string) {
    await this.ensureUnique(dto.isoCode, dto.locale);
    const item = await super.create({
      ...dto,
      status: dto.status ?? Status.ACTIVE,
      sortOrder: dto.sortOrder ?? 0,
      isDefault: dto.isDefault ?? false,
      isRtl: dto.isRtl ?? false,
      createdBy: actorId,
      updatedBy: actorId,
    });
    return createApiResponse("Supported language created successfully", this.toResponse(item));
  }

  async updateLanguage(id: string, dto: UpdateSupportedLanguageDto, actorId: string) {
    await this.ensureUnique(dto.isoCode, dto.locale, id);
    const item = await super.update(id, { ...dto, updatedBy: actorId });
    return createApiResponse("Supported language updated successfully", this.toResponse(item));
  }

  async deleteLanguage(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const item = await super.delete(id);
    return createApiResponse("Supported language deleted successfully", this.toResponse(item));
  }

  async restoreLanguage(id: string, actorId: string) {
    await super.restore(id);
    const item = await super.update(id, { updatedBy: actorId });
    return createApiResponse("Supported language restored successfully", this.toResponse(item));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const item = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("Supported language status updated successfully", this.toResponse(item));
  }

  private async ensureUnique(isoCode?: string, locale?: string, excludeId?: string) {
    if (!isoCode && !locale) return;
    const existing = await this.prisma.supportedLanguage.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(isoCode ? [{ isoCode }] : []),
          ...(locale ? [{ locale }] : []),
        ],
      },
    });
    if (existing) {
      throw new ConflictException("Supported language iso code or locale already exists");
    }
  }

  private toResponse(item: SupportedLanguage): SupportedLanguageResponse {
    const { deletedAt: _deletedAt, ...safeItem } = item;
    return safeItem;
  }
}
