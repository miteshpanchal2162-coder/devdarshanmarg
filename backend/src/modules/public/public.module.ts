import { Module } from "@nestjs/common";
import { PanchangDatesModule } from "../panchang-dates/panchang-dates.module";
import { PublicContentController } from "./content/public-content.controller";
import { PublicContentService } from "./content/public-content.service";
import { PublicDeitiesController } from "./deities/public-deities.controller";
import { PublicDeitiesService } from "./deities/public-deities.service";
import { PublicFestivalsController } from "./festivals/public-festivals.controller";
import { PublicFestivalsService } from "./festivals/public-festivals.service";
import { PublicMediaController } from "./media/public-media.controller";
import { PublicMediaService } from "./media/public-media.service";
import { PublicPanchangController } from "./panchang/public-panchang.controller";
import { PublicPanchangService } from "./panchang/public-panchang.service";
import { PublicTemplesController } from "./temples/public-temples.controller";
import { PublicTemplesService } from "./temples/public-temples.service";

@Module({
  imports: [PanchangDatesModule],
  controllers: [
    PublicTemplesController,
    PublicFestivalsController,
    PublicDeitiesController,
    PublicPanchangController,
    PublicContentController,
    PublicMediaController,
  ],
  providers: [
    PublicTemplesService,
    PublicFestivalsService,
    PublicDeitiesService,
    PublicPanchangService,
    PublicContentService,
    PublicMediaService,
  ],
})
export class PublicModule {}
