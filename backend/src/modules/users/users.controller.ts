import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserQueryDto } from "./dto/user-query.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "List users" })
  @ApiPaginatedResponse(UserResponseDto)
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create user" })
  create(@Body() dto: CreateUserDto, @Req() request: { user: AuthUser }) {
    return this.usersService.createUser(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user" })
  @ApiParam({ name: "id", type: String })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.usersService.updateUser(id, dto, request.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete user" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.usersService.deleteUser(id, request.user.id);
  }

  @Patch(":id/restore")
  @ApiOperation({ summary: "Restore user" })
  @ApiParam({ name: "id", type: String })
  restore(@Param("id") id: string, @Req() request: { user: AuthUser }) {
    return this.usersService.restoreUser(id, request.user.id);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update user status" })
  @ApiParam({ name: "id", type: String })
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateUserStatusDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.usersService.updateStatus(id, dto.status, request.user.id);
  }
}
