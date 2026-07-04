import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateGulikaKaalDto, UpdateGulikaKaalDto } from "./dto/gulika-kaal.dto";
import { GulikaKaalService } from "./gulika-kaal.service";

@ApiTags("Gulika Kaal")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/gulika-kaal")
export class GulikaKaalController {
  constructor(private readonly service: GulikaKaalService) {}

  @Get()
  @ApiOperation({ summary: "Get gulika kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  findByPanchangDate(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId);
  }

  @Post()
  @ApiOperation({ summary: "Create gulika kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreateGulikaKaalDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreateGulikaKaalDto,
  ) {
    return this.service.createGulikaKaal(panchangId, panchangDateId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update gulika kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: UpdateGulikaKaalDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: UpdateGulikaKaalDto,
  ) {
    return this.service.updateGulikaKaal(panchangId, panchangDateId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Delete gulika kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  remove(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.deleteGulikaKaal(panchangId, panchangDateId);
  }
}
