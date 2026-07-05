import { BadRequestException, Injectable } from "@nestjs/common";
import { MediaLibrary, MediaType } from "@prisma/client";
import { BaseCrudService } from "../../common/services/base-crud.service";
import {
  createApiResponse,
  createPaginatedResponse,
} from "../../common/services/api-response.service";
import { RelationValidationService } from "../../common/services/relation-validation.service";
import {
  resolveMediaType,
  validateUploadedFile,
} from "../../common/storage/file-validation.util";
import {
  StorageFolder,
  UploadValidationMode,
  getExtensionWithoutDot,
  sanitizeRelativeStoragePath,
} from "../../common/storage/storage.constants";
import { StorageService } from "../../common/storage/storage.service";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateMediaLibraryDto } from "./dto/create-media-library.dto";
import { MediaLibraryQueryDto } from "./dto/media-library-query.dto";
import { UpdateMediaLibraryDto } from "./dto/update-media-library.dto";

type UploadedFile = Express.Multer.File;

@Injectable()
export class MediaLibraryService extends BaseCrudService<MediaLibrary> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly relationValidation: RelationValidationService,
    private readonly storageService: StorageService,
  ) {
    super(
      prisma.mediaLibrary,
      ["filename", "originalName", "mimeType", "altText", "storagePath"],
      [
        "filename",
        "originalName",
        "mimeType",
        "mediaType",
        "storageType",
        "storagePath",
        "fileSize",
        "width",
        "height",
        "createdAt",
        "updatedAt",
      ],
      ["mediaType", "storageType", "mimeType", "uploadedById"],
    );
  }

  async findAll(query: MediaLibraryQueryDto) {
    const result = await super.findMany(query);
    return createPaginatedResponse(result.items, result.meta);
  }

  async findById(id: string) {
    return createApiResponse("Media library item fetched successfully", await super.findOne(id));
  }

  async createItem(dto: CreateMediaLibraryDto, actorId: string) {
    await this.validateRelations(dto);
    const item = await super.create({
      ...dto,
      storagePath: sanitizeRelativeStoragePath(dto.storagePath),
      storageType: dto.storageType ?? "local",
      uploadedById: dto.uploadedById ?? actorId,
    });
    return createApiResponse("Media library item created successfully", item);
  }

  async updateItem(id: string, dto: UpdateMediaLibraryDto) {
    await this.validateRelations(dto);
    const item = await super.update(id, {
      ...dto,
      ...(dto.storagePath ? { storagePath: sanitizeRelativeStoragePath(dto.storagePath) } : {}),
    });
    return createApiResponse("Media library item updated successfully", item);
  }

  async deleteItem(id: string) {
    const item = await super.findOne(id);
    this.storageService.deletePhysicalFile(item.storagePath);
    const deleted = await this.prisma.mediaLibrary.delete({ where: { id } });
    return createApiResponse("Media library item deleted successfully", deleted);
  }

  async uploadFile(
    file: UploadedFile | undefined,
    folder: StorageFolder,
    actorId: string,
    mode: UploadValidationMode,
    altText?: string,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    const relativePath = this.storageService.buildRelativePath(folder, file.filename);

    try {
      validateUploadedFile(file, mode);
      const extension = getExtensionWithoutDot(file.originalname);
      const mediaType = this.toPrismaMediaType(resolveMediaType(file.mimetype, extension));

      const item = await super.create({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        mediaType,
        storagePath: relativePath,
        storageType: "local",
        fileSize: file.size,
        altText,
        uploadedById: actorId,
      });

      return createApiResponse("Media library file uploaded successfully", item);
    } catch (error) {
      this.storageService.deleteUploadedFileIfExists(relativePath);
      throw error;
    }
  }

  private toPrismaMediaType(mediaType: "image" | "document"): MediaType {
    return mediaType === "image" ? MediaType.image : MediaType.document;
  }

  private async validateRelations(dto: CreateMediaLibraryDto | UpdateMediaLibraryDto) {
    if (dto.uploadedById) {
      await this.relationValidation.validateForeignKeys({ userId: dto.uploadedById });
    }
  }
}
