import { Module } from "@nestjs/common";
import { UserRatingsController } from "./user-ratings.controller";
import { UserRatingsService } from "./user-ratings.service";

@Module({
  controllers: [UserRatingsController],
  providers: [UserRatingsService],
  exports: [UserRatingsService],
})
export class UserRatingsModule {}
