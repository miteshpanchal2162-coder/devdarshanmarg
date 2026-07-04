import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { appConfig } from "./config/app.config";
import { envValidationSchema } from "./config/env.validation";
import { PrismaModule } from "./database/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AreasModule } from "./modules/areas/areas.module";
import { CitiesModule } from "./modules/cities/cities.module";
import { ContinentsModule } from "./modules/continents/continents.module";
import { CountriesModule } from "./modules/countries/countries.module";
import { HealthModule } from "./modules/health/health.module";
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
import { UsersModule } from "./modules/users/users.module";

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
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ContinentsModule,
    CountriesModule,
    StatesModule,
    CitiesModule,
    AreasModule,
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
})
export class AppModule {}
