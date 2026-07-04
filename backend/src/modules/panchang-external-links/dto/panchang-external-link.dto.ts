import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class PanchangExternalLinkQueryDto extends BaseQueryDto {}

export class CreatePanchangExternalLinkDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  linkCode: string;

  @ApiProperty()
  @IsString()
  @MaxLength(300)
  title: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  linkType: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isOfficial?: boolean;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdatePanchangExternalLinkDto extends PartialType(CreatePanchangExternalLinkDto) {}

export class UpdatePanchangExternalLinkStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class PanchangExternalLinkResponseDto extends CreatePanchangExternalLinkDto {
  @ApiProperty()
  id: string;
}
