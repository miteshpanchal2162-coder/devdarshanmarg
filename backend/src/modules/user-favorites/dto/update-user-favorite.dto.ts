import { PartialType } from "@nestjs/swagger";
import { CreateUserFavoriteDto } from "./user-favorite.dto";

export class UpdateUserFavoriteDto extends PartialType(CreateUserFavoriteDto) {}
