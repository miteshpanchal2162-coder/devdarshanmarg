import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateUserProfileDto } from "./user-profile.dto";

export class UpdateUserProfileDto extends PartialType(
  OmitType(CreateUserProfileDto, ["userId"] as const),
) {}
