import { Module } from "@nestjs/common";
import { AbhijitMuhuratController } from "./abhijit-muhurat.controller";
import { AbhijitMuhuratService } from "./abhijit-muhurat.service";

@Module({
  controllers: [AbhijitMuhuratController],
  providers: [AbhijitMuhuratService],
})
export class AbhijitMuhuratModule {}
