import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UserNotificationPreference } from "@prisma/client";
import { createApiResponse } from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateUserNotificationPreferenceDto } from "./dto/user-notification-preference.dto";
import { UpdateUserNotificationPreferenceDto } from "./dto/update-user-notification-preference.dto";

@Injectable()
export class UserNotificationPreferencesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
  ) {}

  async findByUserId(userId: string) {
    await this.relationValidation.validateForeignKeys({ userId });
    const item = await this.prisma.userNotificationPreference.findUnique({
      where: { userId },
    });

    if (!item) {
      throw new NotFoundException("User notification preference not found");
    }

    return createApiResponse("User notification preference fetched successfully", item);
  }

  async createPreference(userId: string, dto: CreateUserNotificationPreferenceDto) {
    await this.relationValidation.validateForeignKeys({ userId });
    const existing = await this.prisma.userNotificationPreference.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException("User notification preference already exists for this user");
    }

    const item = await this.prisma.userNotificationPreference.create({
      data: {
        userId,
        emailEnabled: dto.emailEnabled ?? true,
        smsEnabled: dto.smsEnabled ?? false,
        pushEnabled: dto.pushEnabled ?? true,
        whatsappEnabled: dto.whatsappEnabled ?? false,
        festivalReminder: dto.festivalReminder ?? true,
        fastingReminder: dto.fastingReminder ?? true,
        templeUpdate: dto.templeUpdate ?? true,
        newsletter: dto.newsletter ?? false,
      },
    });

    return createApiResponse("User notification preference created successfully", item);
  }

  async updatePreference(userId: string, dto: UpdateUserNotificationPreferenceDto) {
    const existing = await this.ensureRecord(userId);
    const item = await this.prisma.userNotificationPreference.update({
      where: { id: existing.id },
      data: dto,
    });

    return createApiResponse("User notification preference updated successfully", item);
  }

  async deletePreference(userId: string) {
    const existing = await this.ensureRecord(userId);
    const item = await this.prisma.userNotificationPreference.delete({
      where: { id: existing.id },
    });

    return createApiResponse("User notification preference deleted successfully", item);
  }

  private async ensureRecord(userId: string): Promise<UserNotificationPreference> {
    await this.relationValidation.validateForeignKeys({ userId });
    const item = await this.prisma.userNotificationPreference.findUnique({
      where: { userId },
    });

    if (!item) {
      throw new NotFoundException("User notification preference not found");
    }

    return item;
  }
}
