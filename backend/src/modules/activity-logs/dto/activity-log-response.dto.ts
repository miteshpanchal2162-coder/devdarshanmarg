import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ActivityLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ nullable: true })
  userId: string | null;

  @ApiProperty()
  action: string;

  @ApiProperty()
  entityType: string;

  @ApiPropertyOptional({ nullable: true })
  entityId: string | null;

  @ApiPropertyOptional({ type: Object, nullable: true })
  details: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true })
  ipAddress: string | null;

  @ApiProperty()
  createdAt: Date;
}
