import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Status, UserEntityType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class UserCommentQueryDto extends BaseQueryDto {
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
  @IsUUID()
  parentCommentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  isEdited?: boolean;
}

export class CreateUserCommentDto {
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
  @IsUUID()
  parentCommentId?: string;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiPropertyOptional({ enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}

export class UpdateUserCommentDto extends PartialType(CreateUserCommentDto) {}

export class UpdateUserCommentStatusDto {
  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  status: Status;
}
