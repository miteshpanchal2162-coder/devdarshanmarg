import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Status, UserEntityType } from "@prisma/client";

export class UserCommentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: UserEntityType })
  entityType: UserEntityType;

  @ApiProperty()
  entityId: string;

  @ApiPropertyOptional({ nullable: true })
  parentCommentId: string | null;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  isEdited: boolean;

  @ApiProperty({ enum: Status })
  status: Status;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
