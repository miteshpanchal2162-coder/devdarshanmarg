import { Module } from "@nestjs/common";
import { PanchangDatesModule } from "../panchang-dates/panchang-dates.module";
import { StorageModule } from "../../common/storage/storage.module";
import { PublicContentController } from "./content/public-content.controller";
import { PublicContentService } from "./content/public-content.service";
import { PublicDeitiesController } from "./deities/public-deities.controller";
import { PublicDeitiesService } from "./deities/public-deities.service";
import { PublicFestivalsController } from "./festivals/public-festivals.controller";
import { PublicFestivalsService } from "./festivals/public-festivals.service";
import { PublicMediaController } from "./media/public-media.controller";
import { PublicMediaService } from "./media/public-media.service";
import { PublicMediaVisibilityService } from "./media/public-media-visibility.service";
import { PublicPanchangController } from "./panchang/public-panchang.controller";
import { PublicPanchangService } from "./panchang/public-panchang.service";
import { PublicSeoController } from "./seo/public-seo.controller";
import { PublicSeoService } from "./seo/public-seo.service";
import { PublicTemplesController } from "./temples/public-temples.controller";
import { PublicTemplesService } from "./temples/public-temples.service";

@Module({
  imports: [PanchangDatesModule, StorageModule],
  controllers: [
    PublicTemplesController,
    PublicFestivalsController,
    PublicDeitiesController,
    PublicPanchangController,
    PublicContentController,
    PublicMediaController,
    PublicSeoController,
  ],
  providers: [
    PublicTemplesService,
    PublicFestivalsService,
    PublicDeitiesService,
    PublicPanchangService,
    PublicContentService,
    PublicMediaService,
    PublicMediaVisibilityService,
    PublicSeoService,
  ],
})
export class PublicModule {}
