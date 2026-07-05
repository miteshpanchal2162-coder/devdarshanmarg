import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { BaseQueryDto } from "../../../common/dto/base-query.dto";

export class ContentTagMapQueryDto extends BaseQueryDto {}

export class CreateContentTagMapDto {
  @ApiProperty()
  @IsUUID()
  tagId: string;
}

export class UpdateContentTagMapDto extends PartialType(CreateContentTagMapDto) {}

export class ContentTagMapResponseDto extends CreateContentTagMapDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contentId: string;

  @ApiProperty()
  createdAt: Date;
}
