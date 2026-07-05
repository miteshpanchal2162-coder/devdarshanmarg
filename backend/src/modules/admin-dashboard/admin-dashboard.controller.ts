import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AdminDashboardService } from "./admin-dashboard.service";

@ApiTags("Admin - Dashboard")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("admin/dashboard")
export class AdminDashboardController {
  constructor(private readonly service: AdminDashboardService) {}

  @Get("stats")
  @ApiOperation({ summary: "Get admin dashboard statistics" })
  getStats() {
    return this.service.getStats();
  }
}
