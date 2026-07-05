import { PartialType } from "@nestjs/swagger";
import { CreateUserSessionDto } from "./user-session.dto";

export class UpdateUserSessionDto extends PartialType(CreateUserSessionDto) {}
