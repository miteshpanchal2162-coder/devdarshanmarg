import { Module } from "@nestjs/common";
import { TempleContactsController } from "./temple-contacts.controller";
import { TempleContactsService } from "./temple-contacts.service";

@Module({
  controllers: [TempleContactsController],
  providers: [TempleContactsService],
})
export class TempleContactsModule {}
