import { ConflictException, Injectable } from "@nestjs/common";
import { Status, User, UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserQueryDto } from "./dto/user-query.dto";

type UserResponse = Omit<User, "passwordHash" | "deletedAt">;

@Injectable()
export class UsersService extends BaseCrudService<User> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user, ["fullName", "email", "mobile"]);
  }

  async findAll(query: UserQueryDto) {
    const filters: Record<string, string | number | boolean> = {
      ...(query.filters ?? {}),
    };

    if (query.role) filters.role = query.role;
    if (query.emailVerified !== undefined) filters.emailVerified = query.emailVerified;
    if (query.mobileVerified !== undefined) filters.mobileVerified = query.mobileVerified;

    const result = await super.findMany({ ...query, filters });

    return createPaginatedResponse(
      result.items.map((user) => this.toResponse(user)),
      result.meta,
    );
  }

  async findById(id: string) {
    const user = await super.findOne(id);
    return createApiResponse("User fetched successfully", this.toResponse(user));
  }

  async createUser(dto: CreateUserDto, actorId: string) {
    await this.ensureUniqueContact(dto.email, dto.mobile);

    const user = await super.create({
      email: dto.email,
      emailVerified: dto.emailVerified ?? false,
      fullName: dto.fullName,
      mobile: dto.mobile,
      mobileVerified: dto.mobileVerified ?? false,
      passwordHash: await hash(dto.password, 12),
      profileImage: dto.profileImage,
      role: dto.role ?? UserRole.USER,
      status: dto.status ?? Status.ACTIVE,
      createdBy: actorId,
      updatedBy: actorId,
    });

    return createApiResponse("User created successfully", this.toResponse(user));
  }

  async updateUser(id: string, dto: UpdateUserDto, actorId: string) {
    await this.ensureUniqueContact(dto.email, dto.mobile, id);

    const { password, ...rest } = dto;
    const user = await super.update(id, {
      ...rest,
      ...(password ? { passwordHash: await hash(password, 12) } : {}),
      updatedBy: actorId,
    });

    return createApiResponse("User updated successfully", this.toResponse(user));
  }

  async deleteUser(id: string, actorId: string) {
    await super.update(id, { updatedBy: actorId });
    const user = await super.delete(id);
    return createApiResponse("User deleted successfully", this.toResponse(user));
  }

  async restoreUser(id: string, actorId: string) {
    await super.restore(id);
    const user = await super.update(id, { updatedBy: actorId });
    return createApiResponse("User restored successfully", this.toResponse(user));
  }

  async updateStatus(id: string, status: Status, actorId: string) {
    const user = await super.update(id, { status, updatedBy: actorId });
    return createApiResponse("User status updated successfully", this.toResponse(user));
  }

  private async ensureUniqueContact(email?: string, mobile?: string, excludeId?: string) {
    if (!email && !mobile) return;

    const existing = await this.prisma.user.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [
          ...(email ? [{ email }] : []),
          ...(mobile ? [{ mobile }] : []),
        ],
      },
    });

    if (existing) {
      throw new ConflictException("Email or mobile already exists");
    }
  }

  private toResponse(user: User): UserResponse {
    const { passwordHash: _passwordHash, deletedAt: _deletedAt, ...safeUser } = user;
    return safeUser;
  }
}
