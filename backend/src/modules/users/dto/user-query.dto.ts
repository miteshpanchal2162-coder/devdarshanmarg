import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { Status, UserRole } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class UserFiltersDto {
  @ApiPropertyOptional({ enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ enum: Status })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  emailVerified?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  mobileVerified?: boolean;
}

export class UserQueryDto extends IntersectionType(BaseQueryDto, UserFiltersDto) {}
