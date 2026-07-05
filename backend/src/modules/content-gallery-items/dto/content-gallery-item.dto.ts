import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsUUID, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentGalleryItemQueryDto extends BaseQueryDto {}

export class CreateContentGalleryItemDto {
  @ApiProperty()
  @IsUUID()
  mediaId: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateContentGalleryItemDto extends PartialType(CreateContentGalleryItemDto) {}

export class ContentGalleryItemResponseDto extends CreateContentGalleryItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  galleryId: string;

  @ApiProperty()
  createdAt: Date;
}
