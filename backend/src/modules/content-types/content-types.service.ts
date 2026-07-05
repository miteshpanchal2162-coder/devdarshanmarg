import { ConflictException, Injectable } from "@nestjs/common";
import { ContentType } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { ContentTypeQueryDto, CreateContentTypeDto, UpdateContentTypeDto } from "./dto/content-type.dto";

@Injectable()
export class ContentTypesService extends BaseCrudService<ContentType> {
  constructor(private readonly prisma: PrismaService) {
    super(
      prisma.contentType,
      ["name", "slug"],
      ["name", "slug", "createdAt", "updatedAt"],
      [],
    );
  }

  async findAll(query: ContentTypeQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(result.items, result.meta);
  }

  async findById(id: string) {
    return createApiResponse("Content type fetched successfully", await super.findOne(id));
  }

  async createType(dto: CreateContentTypeDto) {
    await this.ensureUniqueSlug(dto.slug);
    const item = await super.create(dto);
    return createApiResponse("Content type created successfully", item);
  }

  async updateType(id: string, dto: UpdateContentTypeDto) {
    if (dto.slug) {
      await this.ensureUniqueSlug(dto.slug, id);
    }
    const item = await super.update(id, dto);
    return createApiResponse("Content type updated successfully", item);
  }

  async deleteType(id: string) {
    await super.findOne(id);
    const item = await this.prisma.contentType.delete({ where: { id } });
    return createApiResponse("Content type deleted successfully", item);
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.prisma.contentType.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException("Content type slug already exists");
    }
  }
}
