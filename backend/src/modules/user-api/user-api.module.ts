import { Module } from "@nestjs/common";
import { UserCommentsModule } from "../user-comments/user-comments.module";
import { UserFavoritesModule } from "../user-favorites/user-favorites.module";
import { UserNotificationPreferencesModule } from "../user-notification-preferences/user-notification-preferences.module";
import { UserProfilesModule } from "../user-profiles/user-profiles.module";
import { UserRatingsModule } from "../user-ratings/user-ratings.module";
import { UserReviewsModule } from "../user-reviews/user-reviews.module";
import { UserSessionsModule } from "../user-sessions/user-sessions.module";
import { MeAccountController, MeSessionsController } from "./me-sessions.controller";
import { MeCommentsController } from "./me-comments.controller";
import { MeCommentsService } from "./me-comments.service";
import { MeFavoritesController } from "./me-favorites.controller";
import { MeFavoritesService } from "./me-favorites.service";
import { MeNotificationPreferencesController } from "./me-notification-preferences.controller";
import { MeNotificationPreferencesService } from "./me-notification-preferences.service";
import { MeProfileController } from "./me-profile.controller";
import { MeProfileService } from "./me-profile.service";
import { MeRatingsController } from "./me-ratings.controller";
import { MeRatingsService } from "./me-ratings.service";
import { MeReviewsController } from "./me-reviews.controller";
import { MeReviewsService } from "./me-reviews.service";

@Module({
  imports: [
    UserProfilesModule,
    UserFavoritesModule,
    UserRatingsModule,
    UserReviewsModule,
    UserCommentsModule,
    UserSessionsModule,
    UserNotificationPreferencesModule,
  ],
  controllers: [
    MeProfileController,
    MeFavoritesController,
    MeRatingsController,
    MeReviewsController,
    MeCommentsController,
    MeSessionsController,
    MeAccountController,
    MeNotificationPreferencesController,
  ],
  providers: [
    MeProfileService,
    MeFavoritesService,
    MeRatingsService,
    MeReviewsService,
    MeCommentsService,
    MeNotificationPreferencesService,
  ],
})
export class UserApiModule {}
