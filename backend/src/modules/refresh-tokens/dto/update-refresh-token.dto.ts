import { PartialType } from "@nestjs/swagger";
import { CreateRefreshTokenRecordDto } from "./refresh-token.dto";

export class UpdateRefreshTokenRecordDto extends PartialType(CreateRefreshTokenRecordDto) {}
