import {
  Body,
  Controller,
  Delete,
  Get,
  MethodNotAllowedException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ApiPaginatedResponse } from "../../common/decorators/api-paginated-response.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { ActivityLogsService } from "./activity-logs.service";
import { ActivityLogQueryDto } from "./dto/activity-log-query.dto";
import { ActivityLogResponseDto } from "./dto/activity-log-response.dto";
import { CreateActivityLogDto } from "./dto/create-activity-log.dto";

@ApiTags("Activity Logs")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("activity-logs")
export class ActivityLogsController {
  constructor(private readonly service: ActivityLogsService) {}

  @Get()
  @ApiOperation({ summary: "List activity logs" })
  @ApiPaginatedResponse(ActivityLogResponseDto)
  findAll(@Query() query: ActivityLogQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get activity log by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create activity log entry" })
  @ApiBody({ type: CreateActivityLogDto })
  create(@Body() dto: CreateActivityLogDto) {
    return this.service.createLog(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Not allowed — activity logs are append-only" })
  @ApiResponse({ status: 405, description: "Method Not Allowed" })
  update() {
    throw new MethodNotAllowedException("Activity logs are append-only");
  }

  @Put(":id")
  @ApiOperation({ summary: "Not allowed — activity logs are append-only" })
  @ApiResponse({ status: 405, description: "Method Not Allowed" })
  replace() {
    throw new MethodNotAllowedException("Activity logs are append-only");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Not allowed — activity logs are append-only" })
  @ApiResponse({ status: 405, description: "Method Not Allowed" })
  remove() {
    throw new MethodNotAllowedException("Activity logs are append-only");
  }
}
