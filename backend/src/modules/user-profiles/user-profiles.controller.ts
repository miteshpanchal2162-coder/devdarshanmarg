import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateUserProfileDto, UserProfileQueryDto } from "./dto/user-profile.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { UserProfileResponseDto } from "./dto/user-profile-response.dto";
import { UserProfilesService } from "./user-profiles.service";

@ApiTags("User Profiles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("user-profiles")
export class UserProfilesController {
  constructor(private readonly service: UserProfilesService) {}

  @Get()
  @ApiOperation({ summary: "List user profiles" })
  @ApiPaginatedResponse(UserProfileResponseDto)
  findAll(@Query() query: UserProfileQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user profile by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create user profile" })
  @ApiBody({ type: CreateUserProfileDto })
  create(@Body() dto: CreateUserProfileDto) {
    return this.service.createProfile(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user profile" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateUserProfileDto })
  update(@Param("id") id: string, @Body() dto: UpdateUserProfileDto) {
    return this.service.updateProfile(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user profile" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteProfile(id);
  }
}
