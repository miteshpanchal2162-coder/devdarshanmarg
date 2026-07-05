import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status, UserEntityType } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class UserReviewQueryDto extends BaseQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

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

export class CreateUserReviewDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: UserEntityType })
  @IsEnum(UserEntityType)
  entityType: UserEntityType;

  @ApiProperty()
  @IsUUID()
  entityId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty()
  @IsString()
  review: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}

export class UpdateUserReviewDto extends PartialType(CreateUserReviewDto) {}

export class UpdateUserReviewStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}
