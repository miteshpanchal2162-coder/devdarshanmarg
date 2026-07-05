import { OmitType, PartialType } from "@nestjs/swagger";
import { UpdateUserProfileDto } from "../../user-profiles/dto/update-user-profile.dto";
import { CreateUserFavoriteDto } from "../../user-favorites/dto/user-favorite.dto";
import { CreateUserRatingDto } from "../../user-ratings/dto/user-rating.dto";
import { UpdateUserRatingDto } from "../../user-ratings/dto/update-user-rating.dto";
import { CreateUserReviewDto } from "../../user-reviews/dto/user-review.dto";
import { CreateUserCommentDto } from "../../user-comments/dto/user-comment.dto";

export class MeUpdateProfileDto extends UpdateUserProfileDto {}

export class MeCreateFavoriteDto extends OmitType(CreateUserFavoriteDto, ["userId"] as const) {}

export class MeCreateRatingDto extends OmitType(CreateUserRatingDto, ["userId"] as const) {}

export class MeUpdateRatingDto extends OmitType(UpdateUserRatingDto, ["userId"] as const) {}

export class MeCreateReviewDto extends OmitType(CreateUserReviewDto, [
  "userId",
  "isVerified",
  "status",
] as const) {}

export class MeUpdateReviewDto extends PartialType(MeCreateReviewDto) {}

export class MeCreateCommentDto extends OmitType(CreateUserCommentDto, ["userId", "status"] as const) {}

export class MeUpdateCommentDto extends PartialType(MeCreateCommentDto) {}
