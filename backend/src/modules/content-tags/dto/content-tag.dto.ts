import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentTagQueryDto extends BaseQueryDto {}

export class CreateContentTagDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  slug: string;
}

export class UpdateContentTagDto extends PartialType(CreateContentTagDto) {}

export class ContentTagResponseDto extends CreateContentTagDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;
}
