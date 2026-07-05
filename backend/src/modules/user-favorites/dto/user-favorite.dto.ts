import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserEntityType } from "@prisma/client";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class UserFavoriteQueryDto extends BaseQueryDto {
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

export class CreateUserFavoriteDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: UserEntityType })
  @IsEnum(UserEntityType)
  entityType: UserEntityType;

  @ApiProperty()
  @IsUUID()
  entityId: string;
}
