import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateYamagandaKaalDto, UpdateYamagandaKaalDto } from "./dto/yamaganda-kaal.dto";
import { YamagandaKaalService } from "./yamaganda-kaal.service";

@ApiTags("Yamaganda Kaal")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/yamaganda-kaal")
export class YamagandaKaalController {
  constructor(private readonly service: YamagandaKaalService) {}

  @Get()
  @ApiOperation({ summary: "Get yamaganda kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  findByPanchangDate(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId);
  }

  @Post()
  @ApiOperation({ summary: "Create yamaganda kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreateYamagandaKaalDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreateYamagandaKaalDto,
  ) {
    return this.service.createYamagandaKaal(panchangId, panchangDateId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update yamaganda kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: UpdateYamagandaKaalDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: UpdateYamagandaKaalDto,
  ) {
    return this.service.updateYamagandaKaal(panchangId, panchangDateId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Delete yamaganda kaal" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  remove(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.deleteYamagandaKaal(panchangId, panchangDateId);
  }
}
