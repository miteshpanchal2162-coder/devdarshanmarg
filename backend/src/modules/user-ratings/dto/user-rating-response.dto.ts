import { ApiProperty } from "@nestjs/swagger";
import { UserEntityType } from "@prisma/client";

export class UserRatingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: UserEntityType })
  entityType: UserEntityType;

  @ApiProperty()
  entityId: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
