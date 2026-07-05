import { ApiProperty } from "@nestjs/swagger";

export class UserNotificationPreferenceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  emailEnabled: boolean;

  @ApiProperty()
  smsEnabled: boolean;

  @ApiProperty()
  pushEnabled: boolean;

  @ApiProperty()
  whatsappEnabled: boolean;

  @ApiProperty()
  festivalReminder: boolean;

  @ApiProperty()
  fastingReminder: boolean;

  @ApiProperty()
  templeUpdate: boolean;

  @ApiProperty()
  newsletter: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
