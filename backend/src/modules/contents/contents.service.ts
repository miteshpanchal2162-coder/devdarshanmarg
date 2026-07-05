import { ConflictException, Injectable } from "@nestjs/common";
import { Content, ContentStatus } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentQueryDto, CreateContentDto, UpdateContentDto } from "./dto/content.dto";

@Injectable()
export class ContentsService extends BaseCrudService<Content> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.content,
      ["slug"],
      ["slug", "status", "publishedAt", "createdAt", "updatedAt"],
      ["status"],
    );
  }

  async findAll(query: ContentQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(result.items, result.meta);
  }

  async findById(id: string) {
    return createApiResponse("Content fetched successfully", await super.findOne(id));
  }

  async createContent(dto: CreateContentDto) {
    await this.relationValidation.validateForeignKeys({ contentTypeId: dto.contentTypeId });
    await this.ensureUniqueSlug(dto.slug);
    const item = await super.create({
      ...dto,
      status: dto.status ?? ContentStatus.draft,
      ...(dto.publishedAt ? { publishedAt: new Date(dto.publishedAt) } : {}),
    });
    return createApiResponse("Content created successfully", item);
  }

  async updateContent(id: string, dto: UpdateContentDto) {
    if (dto.contentTypeId) {
      await this.relationValidation.validateForeignKeys({ contentTypeId: dto.contentTypeId });
    }
    if (dto.slug) {
      await this.ensureUniqueSlug(dto.slug, id);
    }
    const payload = {
      ...dto,
      ...(dto.publishedAt !== undefined
        ? { publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null }
        : {}),
    };
    const item = await super.update(id, payload);
    return createApiResponse("Content updated successfully", item);
  }

  async deleteContent(id: string) {
    await super.findOne(id);
    const item = await super.update(id, { status: ContentStatus.archived });
    return createApiResponse("Content archived successfully", item);
  }

  async updateStatus(id: string, status: ContentStatus) {
    const item = await super.update(id, { status });
    return createApiResponse("Content status updated successfully", item);
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.prisma.content.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Content slug already exists");
    }
  }
}
