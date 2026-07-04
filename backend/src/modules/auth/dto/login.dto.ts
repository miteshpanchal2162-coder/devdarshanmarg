import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin@example.com" })
  @IsNotEmpty()
  @IsString()
  identifier!: string;

  @ApiProperty({ example: "StrongPassword123!" })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}
