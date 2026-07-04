import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class CreateGulikaKaalDto {
  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;
}

export class UpdateGulikaKaalDto extends PartialType(CreateGulikaKaalDto) {}

export class GulikaKaalResponseDto extends CreateGulikaKaalDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  panchangDateId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
