import { ApiProperty } from "@nestjs/swagger";
import { UserEntityType } from "@prisma/client";

export class UserFavoriteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: UserEntityType })
  entityType: UserEntityType;

  @ApiProperty()
  entityId: string;

  @ApiProperty()
  createdAt: Date;
}
