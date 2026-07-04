import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateRahuKaalDto, UpdateRahuKaalDto } from "./dto/rahu-kaal.dto";
import { RahuKaalService } from "./rahu-kaal.service";

@ApiTags("Rahu Kaal")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/rahu-kaal")
export class RahuKaalController {
  constructor(private readonly service: RahuKaalService) {}

  @Get()
  @ApiOperation({ summary: "Get rahu kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  findByPanchangDate(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId);
  }

  @Post()
  @ApiOperation({ summary: "Create rahu kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreateRahuKaalDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreateRahuKaalDto,
  ) {
    return this.service.createRahuKaal(panchangId, panchangDateId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update rahu kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: UpdateRahuKaalDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: UpdateRahuKaalDto,
  ) {
    return this.service.updateRahuKaal(panchangId, panchangDateId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Delete rahu kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  remove(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.deleteRahuKaal(panchangId, panchangDateId);
  }
}
