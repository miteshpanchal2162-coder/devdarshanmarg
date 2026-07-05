import { ConflictException, Injectable } from "@nestjs/common";
import { UserProfile } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { createPaginationMeta, getPagination } from "../../common/utils/pagination.util";
import {
  buildFieldFilters,
  buildOrderBy,
  buildSearchFilter,
} from "../../common/utils/query.util";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateUserProfileDto, UserProfileQueryDto } from "./dto/user-profile.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";

@Injectable()
export class UserProfilesService extends BaseCrudService<UserProfile> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {
    super(
      prisma.userProfile,
      ["gender", "address", "postalCode", "avatar", "bio"],
      ["gender", "userId", "countryId", "stateId", "cityId", "areaId", "languageId", "createdAt", "updatedAt"],
      ["userId", "countryId", "stateId", "cityId", "areaId", "languageId"],
    );
  }

  async findAll(query: UserProfileQueryDto) {
    const { page, limit, skip, take } = getPagination(query.page, query.limit);
    const where = this.buildWhere({
      ...buildSearchFilter(query.search, ["gender", "address", "postalCode", "avatar", "bio"]),
      ...buildFieldFilters(this.filterQueryFields(query.filters)),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.countryId ? { countryId: query.countryId } : {}),
      ...(query.stateId ? { stateId: query.stateId } : {}),
      ...(query.cityId ? { cityId: query.cityId } : {}),
      ...(query.languageId ? { languageId: query.languageId } : {}),
    });

    const [items, total] = await Promise.all([
      this.prisma.userProfile.findMany({
        where,
        orderBy: buildOrderBy(this.resolveSortBy(query.sortBy), query.sortOrder),
        skip,
        take,
      }),
      this.prisma.userProfile.count({ where }),
    ]);

    return createPaginatedResponse(items, createPaginationMeta(page, limit, total));
  }

  async findById(id: string) {
    return createApiResponse("User profile fetched successfully", await super.findOne(id));
  }

  async createProfile(dto: CreateUserProfileDto) {
    await this.validateRelations(dto);
    await this.ensureUniqueUser(dto.userId);

    const item = await super.create({
      ...dto,
      ...(dto.dateOfBirth ? { dateOfBirth: new Date(dto.dateOfBirth) } : {}),
    });

    return createApiResponse("User profile created successfully", item);
  }

  async updateProfile(id: string, dto: UpdateUserProfileDto) {
    const existing = await super.findOne(id);
    await this.validateRelations({ ...existing, ...dto });

    const item = await super.update(id, {
      ...dto,
      ...(dto.dateOfBirth ? { dateOfBirth: new Date(dto.dateOfBirth) } : {}),
    });

    return createApiResponse("User profile updated successfully", item);
  }

  async deleteProfile(id: string) {
    await super.findOne(id);
    const item = await this.prisma.userProfile.delete({ where: { id } });
    return createApiResponse("User profile deleted successfully", item);
  }

  private async validateRelations(input: {
    areaId?: string | null;
    cityId?: string | null;
    countryId?: string | null;
    languageId?: string | null;
    stateId?: string | null;
    userId?: string;
  }) {
    await this.relationValidation.validateForeignKeys({
      userId: input.userId ?? undefined,
      areaId: input.areaId ?? undefined,
      cityId: input.cityId ?? undefined,
      countryId: input.countryId ?? undefined,
      languageId: input.languageId ?? undefined,
      stateId: input.stateId ?? undefined,
    });

    if (input.countryId && input.stateId) {
      await this.relationValidation.validateStateHierarchy(input.countryId, input.stateId);
    }

    if (input.stateId && input.cityId) {
      await this.relationValidation.validateCityHierarchy(
        input.stateId,
        input.cityId,
        input.countryId ?? undefined,
      );
    }

    if (input.cityId && input.areaId) {
      await this.relationValidation.validateAreaHierarchy(
        input.cityId,
        input.areaId,
        input.stateId ?? undefined,
        input.countryId ?? undefined,
      );
    }
  }

  private async ensureUniqueUser(userId: string) {
    const existing = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (existing) {
      throw new ConflictException("User profile already exists for this user");
    }
  }

  private filterQueryFields(filters?: Record<string, string | number | boolean>) {
    if (!filters) return filters;
    const allowed = new Set(["userId", "countryId", "stateId", "cityId", "areaId", "languageId"]);
    return Object.fromEntries(
      Object.entries(filters).filter(([key]) => allowed.has(key)),
    ) as Record<string, string | number | boolean>;
  }

  private buildWhere(where: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(where).filter(([, value]) => value !== undefined),
    );
  }

  private resolveSortBy(sortBy?: string) {
    if (!sortBy) return undefined;
    const allowed = new Set([
      "gender",
      "userId",
      "countryId",
      "stateId",
      "cityId",
      "areaId",
      "languageId",
      "createdAt",
      "updatedAt",
    ]);
    return allowed.has(sortBy) ? sortBy : undefined;
  }
}
