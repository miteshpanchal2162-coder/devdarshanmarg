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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { createMulterOptions } from "../../common/storage/multer.config";
import { CreateMediaLibraryDto } from "./dto/create-media-library.dto";
import { MediaLibraryQueryDto } from "./dto/media-library-query.dto";
import { MediaLibraryResponseDto } from "./dto/media-library-response.dto";
import { UpdateMediaLibraryDto } from "./dto/update-media-library.dto";
import { UploadMediaLibraryDto } from "./dto/upload-media-library.dto";
import { MediaLibraryService } from "./media-library.service";

const uploadInterceptor = FileInterceptor("file", createMulterOptions());

@ApiTags("Media Library")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("media-library")
export class MediaLibraryController {
  constructor(private readonly service: MediaLibraryService) {}

  @Post("upload/image")
  @UseInterceptors(uploadInterceptor)
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload image to media library" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["file", "folder"],
      properties: {
        file: { type: "string", format: "binary" },
        folder: {
          type: "string",
          enum: ["temples", "festivals", "deities", "contents", "panchang", "users", "temp"],
        },
        altText: { type: "string" },
      },
    },
  })
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaLibraryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.uploadFile(file, dto.folder, request.user.id, "image", dto.altText);
  }

  @Post("upload/document")
  @UseInterceptors(uploadInterceptor)
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload document to media library" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["file", "folder"],
      properties: {
        file: { type: "string", format: "binary" },
        folder: {
          type: "string",
          enum: ["temples", "festivals", "deities", "contents", "panchang", "users", "temp"],
        },
        altText: { type: "string" },
      },
    },
  })
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaLibraryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.uploadFile(file, dto.folder, request.user.id, "document", dto.altText);
  }

  @Post("upload")
  @UseInterceptors(uploadInterceptor)
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload file to media library" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["file", "folder"],
      properties: {
        file: { type: "string", format: "binary" },
        folder: {
          type: "string",
          enum: ["temples", "festivals", "deities", "contents", "panchang", "users", "temp"],
        },
        altText: { type: "string" },
      },
    },
  })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaLibraryDto,
    @Req() request: { user: AuthUser },
  ) {
    return this.service.uploadFile(file, dto.folder, request.user.id, "any", dto.altText);
  }

  @Get()
  @ApiOperation({ summary: "List media library items" })
  @ApiPaginatedResponse(MediaLibraryResponseDto)
  findAll(@Query() query: MediaLibraryQueryDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get media library item by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create media library item" })
  @ApiBody({ type: CreateMediaLibraryDto })
  create(@Body() dto: CreateMediaLibraryDto, @Req() request: { user: AuthUser }) {
    return this.service.createItem(dto, request.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update media library item" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateMediaLibraryDto })
  update(@Param("id") id: string, @Body() dto: UpdateMediaLibraryDto) {
    return this.service.updateItem(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete media library item" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id") id: string) {
    return this.service.deleteItem(id);
  }
}
