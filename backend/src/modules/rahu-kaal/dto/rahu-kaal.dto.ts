import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class CreateRahuKaalDto {
  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;
}

export class UpdateRahuKaalDto extends PartialType(CreateRahuKaalDto) {}

export class RahuKaalResponseDto extends CreateRahuKaalDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  panchangDateId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
