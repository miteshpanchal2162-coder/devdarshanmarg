import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateAbhijitMuhuratDto, UpdateAbhijitMuhuratDto } from "./dto/abhijit-muhurat.dto";
import { AbhijitMuhuratService } from "./abhijit-muhurat.service";

@ApiTags("Abhijit Muhurat")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("panchangs/:panchangId/dates/:panchangDateId/abhijit-muhurat")
export class AbhijitMuhuratController {
  constructor(private readonly service: AbhijitMuhuratService) {}

  @Get()
  @ApiOperation({ summary: "Get abhijit muhurat" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  findByPanchangDate(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.findByPanchangDate(panchangId, panchangDateId);
  }

  @Post()
  @ApiOperation({ summary: "Create abhijit muhurat" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: CreateAbhijitMuhuratDto })
  create(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: CreateAbhijitMuhuratDto,
  ) {
    return this.service.createAbhijitMuhurat(panchangId, panchangDateId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update abhijit muhurat" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  @ApiBody({ type: UpdateAbhijitMuhuratDto })
  update(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
    @Body() dto: UpdateAbhijitMuhuratDto,
  ) {
    return this.service.updateAbhijitMuhurat(panchangId, panchangDateId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Delete abhijit muhurat" })
  @ApiParam({ name: "panchangId", type: String })
  @ApiParam({ name: "panchangDateId", type: String })
  remove(
    @Param("panchangId") panchangId: string,
    @Param("panchangDateId") panchangDateId: string,
  ) {
    return this.service.deleteAbhijitMuhurat(panchangId, panchangDateId);
  }
}
