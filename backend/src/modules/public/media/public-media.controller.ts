import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../../../common/decorators/api-paginated-response.decorator";
import { PublicQueryDto } from "../common/public-query.dto";
import { PublicMediaResponseDto } from "../dto/public-response.dto";
import { PublicMediaService } from "./public-media.service";

@ApiTags("Public - Media")
@Controller("public/media")
export class PublicMediaController {
  constructor(private readonly service: PublicMediaService) {}

  @Get()
  @ApiOperation({ summary: "List media library items" })
  @ApiPaginatedResponse(PublicMediaResponseDto)
  findAll(@Query() query: PublicQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get media library item by ID" })
  @ApiParam({ name: "id", type: String })
  findById(@Param("id") id: string) {
    return this.service.findById(id);
  }
}
