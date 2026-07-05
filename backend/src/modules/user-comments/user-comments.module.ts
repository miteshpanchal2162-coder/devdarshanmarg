import { Module } from "@nestjs/common";
import { UserCommentsController } from "./user-comments.controller";
import { UserCommentsService } from "./user-comments.service";

@Module({
  controllers: [UserCommentsController],
  providers: [UserCommentsService],
  exports: [UserCommentsService],
})
export class UserCommentsModule {}
