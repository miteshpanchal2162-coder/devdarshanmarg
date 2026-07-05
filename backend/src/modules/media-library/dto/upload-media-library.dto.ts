import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import { STORAGE_FOLDERS } from "../../../common/storage/storage.constants";

export class UploadMediaLibraryDto {
  @ApiProperty({ enum: STORAGE_FOLDERS })
  @IsIn([...STORAGE_FOLDERS])
  folder: (typeof STORAGE_FOLDERS)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  altText?: string;
}
