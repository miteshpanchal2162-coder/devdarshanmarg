import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserEntityType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class UserRatingQueryDto extends BaseQueryDto {
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
}

export class CreateUserRatingDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: UserEntityType })
  @IsEnum(UserEntityType)
  entityType: UserEntityType;

  @ApiProperty()
  @IsUUID()
  entityId: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;
}
