import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class DeityAssociationQueryDto extends BaseQueryDto {}

export class CreateDeityAssociationDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  associationType: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  associationName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;

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

export class UpdateDeityAssociationDto extends PartialType(CreateDeityAssociationDto) {}

export class UpdateDeityAssociationStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}

export class DeityAssociationResponseDto extends CreateDeityAssociationDto {
  @ApiProperty()
  id: string;
}
