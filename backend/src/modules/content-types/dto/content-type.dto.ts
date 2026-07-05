import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentTypeQueryDto extends BaseQueryDto {}

export class CreateContentTypeDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name: string;
}

export class UpdateContentTypeDto extends PartialType(CreateContentTypeDto) {}

export class ContentTypeResponseDto extends CreateContentTypeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
