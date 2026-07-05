import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentRelatedItemQueryDto extends BaseQueryDto {}

export class CreateContentRelatedItemDto {
  @ApiProperty()
  @IsUUID()
  relatedContentId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  relationType: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateContentRelatedItemDto extends PartialType(CreateContentRelatedItemDto) {}

export class ContentRelatedItemResponseDto extends CreateContentRelatedItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contentId: string;

  @ApiProperty()
  createdAt: Date;
}
