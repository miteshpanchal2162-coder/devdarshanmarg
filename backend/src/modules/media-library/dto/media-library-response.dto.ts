import { ApiProperty } from "@nestjs/swagger";
import { MediaType } from "@prisma/client";
import { CreateMediaLibraryDto } from "./create-media-library.dto";

export class MediaLibraryResponseDto implements Omit<CreateMediaLibraryDto, "uploadedById"> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty({ enum: MediaType })
  mediaType: MediaType;

  @ApiProperty()
  storagePath: string;

  @ApiProperty()
  storageType: string;

  @ApiProperty()
  fileSize: number;

  @ApiProperty({ required: false })
  width?: number;

  @ApiProperty({ required: false })
  height?: number;

  @ApiProperty({ required: false })
  altText?: string;

  @ApiProperty({ required: false, nullable: true })
  uploadedById: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
