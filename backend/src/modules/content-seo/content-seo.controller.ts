import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  ContentSeoResponseDto,
  CreateContentSeoDto,
  UpdateContentSeoDto,
} from "./dto/content-seo.dto";
import { ContentSeoService } from "./content-seo.service";

@ApiTags("Content SEO")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("content-items/:contentItemId/seo")
export class ContentSeoController {
  constructor(private readonly service: ContentSeoService) {}

  @Get()
  @ApiOperation({ summary: "Get content SEO" })
  @ApiParam({ name: "contentItemId", type: String })
  findByContentItem(@Param("contentItemId") contentItemId: string) {
    return this.service.findByContentItem(contentItemId);
  }

  @Post()
  @ApiOperation({ summary: "Create content SEO" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: CreateContentSeoDto })
  create(@Param("contentItemId") contentItemId: string, @Body() dto: CreateContentSeoDto) {
    return this.service.createSeo(contentItemId, dto);
  }

  @Patch()
  @ApiOperation({ summary: "Update content SEO" })
  @ApiParam({ name: "contentItemId", type: String })
  @ApiBody({ type: UpdateContentSeoDto })
  update(@Param("contentItemId") contentItemId: string, @Body() dto: UpdateContentSeoDto) {
    return this.service.updateSeo(contentItemId, dto);
  }

  @Delete()
  @ApiOperation({ summary: "Delete content SEO" })
  @ApiParam({ name: "contentItemId", type: String })
  remove(@Param("contentItemId") contentItemId: string) {
    return this.service.deleteSeo(contentItemId);
  }
}
