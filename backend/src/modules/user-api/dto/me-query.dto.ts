import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserEntityType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsUUID } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class MeFavoriteQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: UserEntityType })
  @IsOptional()
  @IsEnum(UserEntityType)
  entityType?: UserEntityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  entityId?: string;
}

export class MeRatingQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: UserEntityType })
  @IsOptional()
  @IsEnum(UserEntityType)
  entityType?: UserEntityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  entityId?: string;
}

export class MeReviewQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: UserEntityType })
  @IsOptional()
  @IsEnum(UserEntityType)
  entityType?: UserEntityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  isVerified?: boolean;
}

export class MeCommentQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: UserEntityType })
  @IsOptional()
  @IsEnum(UserEntityType)
  entityType?: UserEntityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  isEdited?: boolean;
}
