import { ConflictException, Injectable } from "@nestjs/common";
import { ContentTag } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentTagQueryDto, CreateContentTagDto, UpdateContentTagDto } from "./dto/content-tag.dto";

@Injectable()
export class ContentTagsService extends BaseCrudService<ContentTag> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.contentTag,
      ["name", "slug"],
      ["name", "slug", "createdAt"],
      [],
    );
  }

  async findAll(query: ContentTagQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(result.items, result.meta);
  }

  async findById(id: string) {
    return createApiResponse("Content tag fetched successfully", await super.findOne(id));
  }

  async createTag(dto: CreateContentTagDto) {
    await this.ensureUniqueSlug(dto.slug);
    const item = await super.create(dto);
    return createApiResponse("Content tag created successfully", item);
  }

  async updateTag(id: string, dto: UpdateContentTagDto) {
    if (dto.slug) {
      await this.ensureUniqueSlug(dto.slug, id);
    }
    const item = await super.update(id, dto);
    return createApiResponse("Content tag updated successfully", item);
  }

  async deleteTag(id: string) {
    await super.findOne(id);
    const item = await this.prisma.contentTag.delete({ where: { id } });
    return createApiResponse("Content tag deleted successfully", item);
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.prisma.contentTag.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Content tag slug already exists");
    }
  }
}
