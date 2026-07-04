import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class CreateYamagandaKaalDto {
  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;
}

export class UpdateYamagandaKaalDto extends PartialType(CreateYamagandaKaalDto) {}

export class YamagandaKaalResponseDto extends CreateYamagandaKaalDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  panchangDateId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
