import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { createApiResponse } from "../../common/services/api-response.service";
import {
  CreateRefreshTokenRecordDto,
  RefreshTokenQueryDto,
  RotateRefreshTokenDto,
} from "./dto/refresh-token.dto";
import { UpdateRefreshTokenRecordDto } from "./dto/update-refresh-token.dto";
import { RefreshTokenRecordResponseDto } from "./dto/refresh-token-response.dto";
import { RefreshTokensService } from "./refresh-tokens.service";

@ApiTags("Refresh Tokens")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("refresh-tokens")
export class RefreshTokensController {
  constructor(private readonly service: RefreshTokensService) {}

  @Get()
  @ApiOperation({ summary: "List refresh tokens" })
  @ApiPaginatedResponse(RefreshTokenRecordResponseDto)
  findAll(@Query() query: RefreshTokenQueryDto) {
    return this.service.findAll(query);
  }

  @Post("rotate")
  @ApiOperation({ summary: "Rotate refresh token (admin)" })
  @ApiBody({ type: RotateRefreshTokenDto })
  async rotate(@Body() dto: RotateRefreshTokenDto) {
    const item = await this.service.rotateToken(dto.refreshToken);
    return createApiResponse("Refresh token rotated successfully", {
      id: item.id,
      userId: item.userId,
      deviceInfo: item.deviceInfo,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get refresh token by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create refresh token record" })
  @ApiBody({ type: CreateRefreshTokenRecordDto })
  create(@Body() dto: CreateRefreshTokenRecordDto) {
    return this.service.createTokenRecord(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update refresh token record" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateRefreshTokenRecordDto })
  update(@Param("id") id: string, @Body() dto: UpdateRefreshTokenRecordDto) {
    return this.service.updateTokenRecord(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete refresh token record" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteTokenRecord(id);
  }

  @Patch(":id/revoke")
  @ApiOperation({ summary: "Revoke refresh token" })
  @ApiParam({ name: "id", type: String })
  revoke(@Param("id") id: string) {
    return this.service.revokeToken(id);
  }
}
