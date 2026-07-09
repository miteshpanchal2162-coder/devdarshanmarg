import { createCrudService } from "@/services/create-crud-service";

export const usersService = createCrudService("/users");
export const templesService = createCrudService("/temples");
export const festivalsService = createCrudService("/festivals");
export const deitiesService = createCrudService("/deities");
export const panchangService = createCrudService("/panchangs");
export const contentService = createCrudService("/content-items");
export const activityLogsService = createCrudService("/activity-logs");
export const userReviewsService = createCrudService("/user-reviews");
export const userCommentsService = createCrudService("/user-comments");
export const countriesService = createCrudService("/countries");
export const statesService = createCrudService("/states");
export const citiesService = createCrudService("/cities");
export const continentsService = createCrudService("/continents");
export const areasService = createCrudService("/areas");
export const contentCategoriesService = createCrudService("/content-categories");
export const seoRedirectsService = createCrudService("/seo-redirects");
export const seoLandingPagesService = createCrudService("/seo-landing-pages");
export const supportedLanguagesService = createCrudService("/supported-languages");
export const supportedMediaTypesService = createCrudService("/supported-media-types");
export const supportedContentStatusesService = createCrudService("/supported-content-statuses");

export function festivalRegionsService(festivalId: string) {
  return createCrudService(`/festivals/${festivalId}/regions`);
}

export function festivalDatesService(festivalId: string) {
  return createCrudService(`/festivals/${festivalId}/dates`);
}

export function festivalTempleMapsService(festivalId: string) {
  return createCrudService(`/festivals/${festivalId}/temple-maps`);
}

export function userNotificationPreferencesService(userId: string) {
  return createCrudService(`/users/${userId}/notification-preferences`);
}
