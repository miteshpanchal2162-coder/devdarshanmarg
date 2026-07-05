import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import { appConfig } from "./config/app.config";
import { envValidationSchema } from "./config/env.validation";
import { createThrottlerOptions } from "./config/throttler.config";
import { PrismaModule } from "./database/prisma/prisma.module";
import { StorageModule } from "./common/storage/storage.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AreasModule } from "./modules/areas/areas.module";
import { AbhijitMuhuratModule } from "./modules/abhijit-muhurat/abhijit-muhurat.module";
import { AmavasyaModule } from "./modules/amavasya/amavasya.module";
import { ChoghadiyasModule } from "./modules/choghadiyas/choghadiyas.module";
import { ContentAttachmentsModule } from "./modules/content-attachments/content-attachments.module";
import { ContentCategoriesModule } from "./modules/content-categories/content-categories.module";
import { ContentGalleriesModule } from "./modules/content-galleries/content-galleries.module";
import { ContentGalleryItemsModule } from "./modules/content-gallery-items/content-gallery-items.module";
import { ContentEntityMapsModule } from "./modules/content-entity-maps/content-entity-maps.module";
import { ContentEntityTypesModule } from "./modules/content-entity-types/content-entity-types.module";
import { ContentItemTranslationsModule } from "./modules/content-item-translations/content-item-translations.module";
import { ContentItemTypesModule } from "./modules/content-item-types/content-item-types.module";
import { ContentItemsModule } from "./modules/content-items/content-items.module";
import { ContentMediaModule } from "./modules/content-media/content-media.module";
import { ContentPublishLogsModule } from "./modules/content-publish-logs/content-publish-logs.module";
import { ContentRelatedItemsModule } from "./modules/content-related-items/content-related-items.module";
import { ContentSeoModule } from "./modules/content-seo/content-seo.module";
import { ContentStatisticsModule } from "./modules/content-statistics/content-statistics.module";
import { ContentTagMapsModule } from "./modules/content-tag-maps/content-tag-maps.module";
import { ContentTagsModule } from "./modules/content-tags/content-tags.module";
import { ContentTranslationsModule } from "./modules/content-translations/content-translations.module";
import { ContentTypesModule } from "./modules/content-types/content-types.module";
import { ContentVersionsModule } from "./modules/content-versions/content-versions.module";
import { ContentsModule } from "./modules/contents/contents.module";
import { EkadashiModule } from "./modules/ekadashi/ekadashi.module";
import { GulikaKaalModule } from "./modules/gulika-kaal/gulika-kaal.module";
import { CitiesModule } from "./modules/cities/cities.module";
import { ContinentsModule } from "./modules/continents/continents.module";
import { CountriesModule } from "./modules/countries/countries.module";
import { DeitiesModule } from "./modules/deities/deities.module";
import { DeityAartisModule } from "./modules/deity-aartis/deity-aartis.module";
import { DeityAttributesModule } from "./modules/deity-attributes/deity-attributes.module";
import { DeityAvatarsModule } from "./modules/deity-avatars/deity-avatars.module";
import { DeityBlessingsModule } from "./modules/deity-blessings/deity-blessings.module";
import { DeityCategoriesModule } from "./modules/deity-categories/deity-categories.module";
import { DeityCategoryMapsModule } from "./modules/deity-category-maps/deity-category-maps.module";
import { DeityChangeHistoryModule } from "./modules/deity-change-history/deity-change-history.module";
import { DeityExternalLinksModule } from "./modules/deity-external-links/deity-external-links.module";
import { DeityFestivalsModule } from "./modules/deity-festivals/deity-festivals.module";
import { DeityMantrasModule } from "./modules/deity-mantras/deity-mantras.module";
import { DeityProfilesModule } from "./modules/deity-profiles/deity-profiles.module";
import { DeityRelationsModule } from "./modules/deity-relations/deity-relations.module";
import { DeityStatisticsModule } from "./modules/deity-statistics/deity-statistics.module";
import { DeityStoriesModule } from "./modules/deity-stories/deity-stories.module";
import { DeityStotrasModule } from "./modules/deity-stotras/deity-stotras.module";
import { DeitySymbolsModule } from "./modules/deity-symbols/deity-symbols.module";
import { DeityTempleMapsModule } from "./modules/deity-temple-maps/deity-temple-maps.module";
import { DeityTranslationsModule } from "./modules/deity-translations/deity-translations.module";
import { DeityTypesModule } from "./modules/deity-types/deity-types.module";
import { DeityAssociationsModule } from "./modules/deity-associations/deity-associations.module";
import { FestivalAartisModule } from "./modules/festival-aartis/festival-aartis.module";
import { FestivalBhajansModule } from "./modules/festival-bhajans/festival-bhajans.module";
import { FestivalCategoriesModule } from "./modules/festival-categories/festival-categories.module";
import { FestivalCategoryMapsModule } from "./modules/festival-category-maps/festival-category-maps.module";
import { FestivalFastingRulesModule } from "./modules/festival-fasting-rules/festival-fasting-rules.module";
import { FestivalFoodsModule } from "./modules/festival-foods/festival-foods.module";
import { FestivalGalleryModule } from "./modules/festival-gallery/festival-gallery.module";
import { FestivalKathasModule } from "./modules/festival-kathas/festival-kathas.module";
import { FestivalMantrasModule } from "./modules/festival-mantras/festival-mantras.module";
import { FestivalPujaVidhisModule } from "./modules/festival-puja-vidhis/festival-puja-vidhis.module";
import { FestivalRitualsModule } from "./modules/festival-rituals/festival-rituals.module";
import { FestivalSamagriModule } from "./modules/festival-samagri/festival-samagri.module";
import { FestivalStatisticsModule } from "./modules/festival-statistics/festival-statistics.module";
import { FestivalTranslationsModule } from "./modules/festival-translations/festival-translations.module";
import { FestivalVideosModule } from "./modules/festival-videos/festival-videos.module";
import { FestivalsModule } from "./modules/festivals/festivals.module";
import { HealthModule } from "./modules/health/health.module";
import { KaranasModule } from "./modules/karanas/karanas.module";
import { MediaLibraryModule } from "./modules/media-library/media-library.module";
import { MuhuratsModule } from "./modules/muhurats/muhurats.module";
import { NakshatrasModule } from "./modules/nakshatras/nakshatras.module";
import { PlanetsModule } from "./modules/planets/planets.module";
import { PradoshModule } from "./modules/pradosh/pradosh.module";
import { PurnimaModule } from "./modules/purnima/purnima.module";
import { RashisModule } from "./modules/rashis/rashis.module";
import { SankashtiModule } from "./modules/sankashti/sankashti.module";
import { VratBenefitsModule } from "./modules/vrat-benefits/vrat-benefits.module";
import { VratDatesModule } from "./modules/vrat-dates/vrat-dates.module";
import { VratFoodRulesModule } from "./modules/vrat-food-rules/vrat-food-rules.module";
import { VratRulesModule } from "./modules/vrat-rules/vrat-rules.module";
import { VratsModule } from "./modules/vrats/vrats.module";
import { PanchangCategoriesModule } from "./modules/panchang-categories/panchang-categories.module";
import { PanchangCategoryMapsModule } from "./modules/panchang-category-maps/panchang-category-maps.module";
import { PanchangChangeHistoryModule } from "./modules/panchang-change-history/panchang-change-history.module";
import { PanchangDatesModule } from "./modules/panchang-dates/panchang-dates.module";
import { PanchangDayElementsModule } from "./modules/panchang-day-elements/panchang-day-elements.module";
import { PanchangExternalLinksModule } from "./modules/panchang-external-links/panchang-external-links.module";
import { PanchangPlanetPositionsModule } from "./modules/panchang-planet-positions/panchang-planet-positions.module";
import { PanchangRashiTransitsModule } from "./modules/panchang-rashi-transits/panchang-rashi-transits.module";
import { PanchangRegionsModule } from "./modules/panchang-regions/panchang-regions.module";
import { PanchangSourcesModule } from "./modules/panchang-sources/panchang-sources.module";
import { PanchangStatisticsModule } from "./modules/panchang-statistics/panchang-statistics.module";
import { PanchangSunTimesModule } from "./modules/panchang-sun-times/panchang-sun-times.module";
import { PanchangTranslationsModule } from "./modules/panchang-translations/panchang-translations.module";
import { PanchangsModule } from "./modules/panchangs/panchangs.module";
import { RahuKaalModule } from "./modules/rahu-kaal/rahu-kaal.module";
import { YamagandaKaalModule } from "./modules/yamaganda-kaal/yamaganda-kaal.module";
import { StatesModule } from "./modules/states/states.module";
import { TempleAartisModule } from "./modules/temple-aartis/temple-aartis.module";
import { TempleAccessibilityModule } from "./modules/temple-accessibility/temple-accessibility.module";
import { TempleAccommodationsModule } from "./modules/temple-accommodations/temple-accommodations.module";
import { TempleCategoriesModule } from "./modules/temple-categories/temple-categories.module";
import { TempleCategoryMapsModule } from "./modules/temple-category-maps/temple-category-maps.module";
import { TempleChangeHistoryModule } from "./modules/temple-change-history/temple-change-history.module";
import { TempleContactsModule } from "./modules/temple-contacts/temple-contacts.module";
import { TempleDarshanTypesModule } from "./modules/temple-darshan-types/temple-darshan-types.module";
import { TempleDeityMapsModule } from "./modules/temple-deity-maps/temple-deity-maps.module";
import { TempleDonationsModule } from "./modules/temple-donations/temple-donations.module";
import { TempleDocumentsModule } from "./modules/temple-documents/temple-documents.module";
import { TempleDressCodesModule } from "./modules/temple-dress-codes/temple-dress-codes.module";
import { TempleExternalLinksModule } from "./modules/temple-external-links/temple-external-links.module";
import { TempleFacilitiesModule } from "./modules/temple-facilities/temple-facilities.module";
import { TempleFaqsModule } from "./modules/temple-faqs/temple-faqs.module";
import { TempleLiveDarshanModule } from "./modules/temple-live-darshan/temple-live-darshan.module";
import { TempleMediaModule } from "./modules/temple-media/temple-media.module";
import { TempleNearbyPlacesModule } from "./modules/temple-nearby-places/temple-nearby-places.module";
import { TempleParkingModule } from "./modules/temple-parking/temple-parking.module";
import { TemplePilgrimTipsModule } from "./modules/temple-pilgrim-tips/temple-pilgrim-tips.module";
import { TemplePoojasModule } from "./modules/temple-poojas/temple-poojas.module";
import { TemplePrasadamsModule } from "./modules/temple-prasadams/temple-prasadams.module";
import { TempleQrCodesModule } from "./modules/temple-qr-codes/temple-qr-codes.module";
import { TempleRulesModule } from "./modules/temple-rules/temple-rules.module";
import { TempleRoutesModule } from "./modules/temple-routes/temple-routes.module";
import { TempleSourcesModule } from "./modules/temple-sources/temple-sources.module";
import { TempleSpecialEventsModule } from "./modules/temple-special-events/temple-special-events.module";
import { TempleStatisticsModule } from "./modules/temple-statistics/temple-statistics.module";
import { TempleTimingsModule } from "./modules/temple-timings/temple-timings.module";
import { TempleTranslationsModule } from "./modules/temple-translations/temple-translations.module";
import { TemplesModule } from "./modules/temples/temples.module";
import { TithisModule } from "./modules/tithis/tithis.module";
import { YogasModule } from "./modules/yogas/yogas.module";
import { UsersModule } from "./modules/users/users.module";
import { UserNotificationPreferencesModule } from "./modules/user-notification-preferences/user-notification-preferences.module";
import { ActivityLogsModule } from "./modules/activity-logs/activity-logs.module";
import { UserProfilesModule } from "./modules/user-profiles/user-profiles.module";
import { UserFavoritesModule } from "./modules/user-favorites/user-favorites.module";
import { UserRatingsModule } from "./modules/user-ratings/user-ratings.module";
import { UserReviewsModule } from "./modules/user-reviews/user-reviews.module";
import { UserCommentsModule } from "./modules/user-comments/user-comments.module";
import { OtpVerificationsModule } from "./modules/otp-verifications/otp-verifications.module";
import { UserSessionsModule } from "./modules/user-sessions/user-sessions.module";
import { RefreshTokensModule } from "./modules/refresh-tokens/refresh-tokens.module";
import { FestivalDatesModule } from "./modules/festival-dates/festival-dates.module";
import { FestivalRegionsModule } from "./modules/festival-regions/festival-regions.module";
import { FestivalTempleMapsModule } from "./modules/festival-temple-maps/festival-temple-maps.module";
import { SeoRedirectsModule } from "./modules/seo-redirects/seo-redirects.module";
import { SeoLandingPagesModule } from "./modules/seo-landing-pages/seo-landing-pages.module";
import { SupportedLanguagesModule } from "./modules/supported-languages/supported-languages.module";
import { SupportedMediaTypesModule } from "./modules/supported-media-types/supported-media-types.module";
import { SupportedContentStatusesModule } from "./modules/supported-content-statuses/supported-content-statuses.module";
import { PublicModule } from "./modules/public/public.module";
import { UserApiModule } from "./modules/user-api/user-api.module";
import { AdminDashboardModule } from "./modules/admin-dashboard/admin-dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.local"],
      isGlobal: true,
      load: [appConfig],
      validationOptions: {
        abortEarly: false,
      },
      validationSchema: envValidationSchema,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? "info",
        transport:
          process.env.NODE_ENV === "development"
            ? {
                target: "pino-pretty",
                options: {
                  colorize: true,
                  singleLine: true,
                },
              }
            : undefined,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule, JwtModule.register({})],
      inject: [ConfigService, JwtService],
      useFactory: (configService: ConfigService, jwtService: JwtService) =>
        createThrottlerOptions(configService, jwtService),
    }),
    PrismaModule,
    StorageModule,
    HealthModule,
    PublicModule,
    UserApiModule,
    AdminDashboardModule,
    AuthModule,
    UsersModule,
    UserNotificationPreferencesModule,
    ActivityLogsModule,
    UserProfilesModule,
    UserFavoritesModule,
    UserRatingsModule,
    UserReviewsModule,
    UserCommentsModule,
    OtpVerificationsModule,
    UserSessionsModule,
    RefreshTokensModule,
    ContinentsModule,
    CountriesModule,
    StatesModule,
    CitiesModule,
    AreasModule,
    ContentsModule,
    ContentTranslationsModule,
    ContentAttachmentsModule,
    ContentCategoriesModule,
    ContentGalleriesModule,
    ContentGalleryItemsModule,
    ContentEntityMapsModule,
    ContentEntityTypesModule,
    ContentItemTranslationsModule,
    ContentItemTypesModule,
    ContentItemsModule,
    ContentMediaModule,
    ContentPublishLogsModule,
    ContentRelatedItemsModule,
    ContentSeoModule,
    ContentStatisticsModule,
    ContentTagMapsModule,
    ContentTagsModule,
    ContentTypesModule,
    ContentVersionsModule,
    DeitiesModule,
    DeityTypesModule,
    DeityTranslationsModule,
    DeityStatisticsModule,
    DeityProfilesModule,
    DeityCategoriesModule,
    DeityCategoryMapsModule,
    DeityAvatarsModule,
    DeitySymbolsModule,
    DeityAttributesModule,
    DeityAssociationsModule,
    DeityRelationsModule,
    DeityBlessingsModule,
    DeityMantrasModule,
    DeityAartisModule,
    DeityStotrasModule,
    DeityStoriesModule,
    DeityFestivalsModule,
    DeityTempleMapsModule,
    DeityExternalLinksModule,
    DeityChangeHistoryModule,
    FestivalsModule,
    FestivalTranslationsModule,
    FestivalStatisticsModule,
    FestivalCategoriesModule,
    FestivalCategoryMapsModule,
    FestivalRitualsModule,
    FestivalPujaVidhisModule,
    FestivalSamagriModule,
    FestivalFastingRulesModule,
    FestivalFoodsModule,
    FestivalKathasModule,
    FestivalMantrasModule,
    FestivalAartisModule,
    FestivalBhajansModule,
    FestivalGalleryModule,
    FestivalVideosModule,
    FestivalDatesModule,
    FestivalRegionsModule,
    FestivalTempleMapsModule,
    SupportedLanguagesModule,
    SupportedMediaTypesModule,
    SupportedContentStatusesModule,
    SeoRedirectsModule,
    SeoLandingPagesModule,
    PanchangsModule,
    PanchangTranslationsModule,
    PanchangStatisticsModule,
    PanchangCategoriesModule,
    PanchangCategoryMapsModule,
    PanchangDatesModule,
    PanchangDayElementsModule,
    PanchangSunTimesModule,
    ChoghadiyasModule,
    RahuKaalModule,
    GulikaKaalModule,
    YamagandaKaalModule,
    AbhijitMuhuratModule,
    EkadashiModule,
    PurnimaModule,
    AmavasyaModule,
    PradoshModule,
    SankashtiModule,
    PanchangPlanetPositionsModule,
    PanchangRashiTransitsModule,
    PanchangRegionsModule,
    PanchangSourcesModule,
    PanchangExternalLinksModule,
    PanchangChangeHistoryModule,
    TithisModule,
    NakshatrasModule,
    YogasModule,
    KaranasModule,
    MediaLibraryModule,
    MuhuratsModule,
    PlanetsModule,
    RashisModule,
    VratsModule,
    VratRulesModule,
    VratBenefitsModule,
    VratFoodRulesModule,
    VratDatesModule,
    TempleTimingsModule,
    TempleTranslationsModule,
    TempleDeityMapsModule,
    TempleCategoriesModule,
    TempleCategoryMapsModule,
    TemplePilgrimTipsModule,
    TempleMediaModule,
    TempleAartisModule,
    TemplePoojasModule,
    TempleDarshanTypesModule,
    TempleSpecialEventsModule,
    TempleFacilitiesModule,
    TempleRulesModule,
    TempleContactsModule,
    TempleFaqsModule,
    TempleAccessibilityModule,
    TempleDressCodesModule,
    TempleRoutesModule,
    TempleNearbyPlacesModule,
    TempleParkingModule,
    TempleAccommodationsModule,
    TemplePrasadamsModule,
    TempleDocumentsModule,
    TempleSourcesModule,
    TempleStatisticsModule,
    TempleLiveDarshanModule,
    TempleDonationsModule,
    TempleExternalLinksModule,
    TempleQrCodesModule,
    TempleChangeHistoryModule,
    TemplesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
