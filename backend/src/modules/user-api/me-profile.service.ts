import { Injectable, NotFoundException } from "@nestjs/common";
import { createApiResponse } from "../../common/services/api-response.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { UserProfilesService } from "../user-profiles/user-profiles.service";
import { MeUpdateProfileDto } from "./dto/me-body.dto";

@Injectable()
export class MeProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userProfilesService: UserProfilesService,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new NotFoundException("User profile not found");
    }

    return createApiResponse("User profile fetched successfully", profile);
  }

  async updateProfile(userId: string, dto: MeUpdateProfileDto) {
    const existing = await this.prisma.userProfile.findUnique({ where: { userId } });

    if (existing) {
      return this.userProfilesService.updateProfile(existing.id, dto);
    }

    return this.userProfilesService.createProfile({ ...dto, userId });
  }
}
