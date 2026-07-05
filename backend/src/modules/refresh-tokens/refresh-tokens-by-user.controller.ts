import { Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RefreshTokenQueryDto } from "./dto/refresh-token.dto";
import { RefreshTokenRecordResponseDto } from "./dto/refresh-token-response.dto";
import { RefreshTokensService } from "./refresh-tokens.service";

@ApiTags("Refresh Tokens")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("users/:userId/refresh-tokens")
export class RefreshTokensByUserController {
  constructor(private readonly service: RefreshTokensService) {}

  @Get()
  @ApiOperation({ summary: "List refresh tokens for a user" })
  @ApiParam({ name: "userId", type: String })
  @ApiPaginatedResponse(RefreshTokenRecordResponseDto)
  findByUserId(@Param("userId") userId: string, @Query() query: RefreshTokenQueryDto) {
    return this.service.findByUserId(userId, query);
  }

  @Patch("revoke-all")
  @ApiOperation({ summary: "Revoke all refresh tokens for a user" })
  @ApiParam({ name: "userId", type: String })
  revokeAll(@Param("userId") userId: string) {
    return this.service.revokeAllUserTokens(userId);
  }
}
