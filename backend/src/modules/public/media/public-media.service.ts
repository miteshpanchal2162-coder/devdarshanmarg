import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { PublicQueryDto } from "../common/public-query.dto";
import { publicFindById, publicFindMany } from "../common/public-response.util";

@Injectable()
export class PublicMediaService {
  private readonly readOptions = {
    allowedFilterFields: ["mediaType", "storageType", "mimeType"],
    allowedSortFields: [
      "filename",
      "originalName",
      "mimeType",
      "mediaType",
      "fileSize",
      "createdAt",
      "updatedAt",
    ],
    searchableFields: ["filename", "originalName", "mimeType", "altText"],
  };

  constructor(private readonly prisma: PrismaService) {}

  findAll(query: PublicQueryDto) {
    return publicFindMany(this.prisma.mediaLibrary, query, {}, this.readOptions);
  }

  findById(id: string) {
    return publicFindById(
      this.prisma.mediaLibrary,
      id,
      {},
      "Media item fetched successfully",
    );
  }
}
