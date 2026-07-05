import { PartialType } from "@nestjs/swagger";
import { CreateUserRatingDto } from "./user-rating.dto";

export class UpdateUserRatingDto extends PartialType(CreateUserRatingDto) {}
