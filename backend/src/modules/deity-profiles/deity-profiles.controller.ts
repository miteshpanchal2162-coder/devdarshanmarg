import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import {
  CreateDeityProfileDto,
  DeityProfileResponseDto,
  UpdateDeityProfileDto,
  UpdateDeityProfileStatusDto,
} from "./dto/deity-profile.dto";
import { DeityProfilesService } from "./deity-profiles.service";

@ApiTags("Deity Profiles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("deities/:deityId/profile")
export class DeityProfilesController {
  constructor(private readonly service: DeityProfilesService) {}

  @Get()
  @ApiOperation({ summary: "Get deity profile" })
  @ApiParam({ name: "deityId", type: String })
  findByDeity(@Param("deityId") deityId: string) {
    return this.service.findByDeity(deityId);
  }

  @Post()
  @ApiOperation({ summary: "Create deity profile" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: CreateDeityProfileDto })
  create(
    @Param("deityId") deityId: string,
    @Body() dto: CreateDeityProfileDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.createProfile(deityId, dto, request.user.id);
  }

  @Patch()
  @ApiOperation({ summary: "Update deity profile" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: UpdateDeityProfileDto })
  update(
    @Param("deityId") deityId: string,
    @Body() dto: UpdateDeityProfileDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateProfile(deityId, dto, request.user.id);
  }

  @Delete()
  @ApiOperation({ summary: "Soft delete deity profile" })
  @ApiParam({ name: "deityId", type: String })
  remove(@Param("deityId") deityId: string, @Req() request: { user: AuthUser }) {
    return this.service.deleteProfile(deityId, request.user.id);
  }

  @Patch("restore")
  @ApiOperation({ summary: "Restore deity profile" })
  @ApiParam({ name: "deityId", type: String })
  restore(@Param("deityId") deityId: string, @Req() request: { user: AuthUser }) {
    return this.service.restoreProfile(deityId, request.user.id);
  }

  @Patch("status")
  @ApiOperation({ summary: "Update deity profile status" })
  @ApiParam({ name: "deityId", type: String })
  @ApiBody({ type: UpdateDeityProfileStatusDto })
  updateStatus(
    @Param("deityId") deityId: string,
    @Body() dto: UpdateDeityProfileStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.updateStatus(deityId, dto.status, request.user.id);
  }
}
