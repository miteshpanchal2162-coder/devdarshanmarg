import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentPublishLogQueryDto extends BaseQueryDto {}

export class CreateContentPublishLogDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  action: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class UpdateContentPublishLogDto extends PartialType(CreateContentPublishLogDto) {}

export class ContentPublishLogResponseDto extends CreateContentPublishLogDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contentId: string;

  @ApiProperty()
  createdAt: Date;
}
