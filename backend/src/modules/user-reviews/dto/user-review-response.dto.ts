import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Status, UserEntityType } from "@prisma/client";

export class UserReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: UserEntityType })
  entityType: UserEntityType;

  @ApiProperty()
  entityId: string;

  @ApiPropertyOptional({ nullable: true })
  title: string | null;

  @ApiProperty()
  review: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty({ enum: Status })
  status: Status;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
