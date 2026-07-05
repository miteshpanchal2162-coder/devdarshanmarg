import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { ApiPaginatedResponse } from "../../../common/decorators/api-paginated-response.decorator";
import { PublicQueryDto } from "../common/public-query.dto";
import { PublicMediaResponseDto } from "../dto/public-response.dto";
import { PublicMediaService } from "./public-media.service";

@ApiTags("Public - Media")
@Controller("public/media")
export class PublicMediaController {
  constructor(private readonly service: PublicMediaService) {}

  @Get()
  @ApiOperation({ summary: "List publicly visible media items" })
  @ApiPaginatedResponse(PublicMediaResponseDto)
  findAll(@Query() query: PublicQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id/file")
  @ApiOperation({ summary: "Stream publicly visible media file" })
  @ApiParam({ name: "id", type: String })
  async streamFile(@Param("id") id: string, @Res({ passthrough: true }) response: Response) {
    const file = await this.service.streamFile(id);
    response.setHeader("Cache-Control", "public, max-age=3600");
    return file;
  }

  @Get(":id")
  @ApiOperation({ summary: "Get publicly visible media item by ID" })
  @ApiParam({ name: "id", type: String })
  findById(@Param("id") id: string) {
    return this.service.findById(id);
  }
}
