import { createCrudHooks } from "@/hooks/crud/create-crud-hooks";
import { queryKeys } from "@/hooks/queries/query-keys";
import {
  activityLogsService,
  areasService,
  citiesService,
  contentCategoriesService,
  contentService,
  continentsService,
  countriesService,
  deitiesService,
  festivalDatesService,
  festivalRegionsService,
  festivalTempleMapsService,
  festivalsService,
  panchangService,
  statesService,
  templesService,
  userCommentsService,
  userReviewsService,
  usersService,
} from "@/services/entities.service";
import { mediaService } from "@/services/media.service";
import { settingsService } from "@/services/settings.service";

const usersHooks = createCrudHooks("User", queryKeys.users, usersService);
export const useUsers = usersHooks.useList;
export const useUser = usersHooks.useDetail;
export const useCreateUser = usersHooks.useCreate;
export const useUpdateUser = usersHooks.useUpdate;
export const useDeleteUser = usersHooks.useDelete;
export const useRestoreUser = usersHooks.useRestore;
export const useUpdateUserStatus = usersHooks.useUpdateStatus;

const templesHooks = createCrudHooks("Temple", queryKeys.temples, templesService);
export const useTemples = templesHooks.useList;
export const useTemple = templesHooks.useDetail;
export const useCreateTemple = templesHooks.useCreate;
export const useUpdateTemple = templesHooks.useUpdate;
export const useDeleteTemple = templesHooks.useDelete;
export const useRestoreTemple = templesHooks.useRestore;
export const useUpdateTempleStatus = templesHooks.useUpdateStatus;

const festivalsHooks = createCrudHooks("Festival", queryKeys.festivals, festivalsService);
export const useFestivals = festivalsHooks.useList;
export const useFestival = festivalsHooks.useDetail;
export const useCreateFestival = festivalsHooks.useCreate;
export const useUpdateFestival = festivalsHooks.useUpdate;
export const useDeleteFestival = festivalsHooks.useDelete;
export const useRestoreFestival = festivalsHooks.useRestore;
export const useUpdateFestivalStatus = festivalsHooks.useUpdateStatus;

const deitiesHooks = createCrudHooks("Deity", queryKeys.deities, deitiesService);
export const useDeities = deitiesHooks.useList;
export const useDeity = deitiesHooks.useDetail;
export const useCreateDeity = deitiesHooks.useCreate;
export const useUpdateDeity = deitiesHooks.useUpdate;
export const useDeleteDeity = deitiesHooks.useDelete;
export const useRestoreDeity = deitiesHooks.useRestore;
export const useUpdateDeityStatus = deitiesHooks.useUpdateStatus;

const panchangHooks = createCrudHooks("Panchang", queryKeys.panchang, panchangService);
export const usePanchangList = panchangHooks.useList;
export const usePanchang = panchangHooks.useDetail;
export const useCreatePanchang = panchangHooks.useCreate;
export const useUpdatePanchang = panchangHooks.useUpdate;
export const useDeletePanchang = panchangHooks.useDelete;
export const useRestorePanchang = panchangHooks.useRestore;
export const useUpdatePanchangStatus = panchangHooks.useUpdateStatus;

const contentHooks = createCrudHooks("Content", queryKeys.content, contentService);
export const useContentItems = contentHooks.useList;
export const useContentItem = contentHooks.useDetail;
export const useCreateContentItem = contentHooks.useCreate;
export const useUpdateContentItem = contentHooks.useUpdate;
export const useDeleteContentItem = contentHooks.useDelete;
export const useRestoreContentItem = contentHooks.useRestore;
export const useUpdateContentItemStatus = contentHooks.useUpdateStatus;

const mediaHooks = createCrudHooks("Media", queryKeys.media, mediaService);
export const useMediaItems = mediaHooks.useList;
export const useMediaItem = mediaHooks.useDetail;
export const useCreateMediaItem = mediaHooks.useCreate;
export const useUpdateMediaItem = mediaHooks.useUpdate;
export const useDeleteMediaItem = mediaHooks.useDelete;

const activityLogsHooks = createCrudHooks("Activity log", queryKeys.activityLogs, activityLogsService);
export const useActivityLogs = activityLogsHooks.useList;
export const useActivityLog = activityLogsHooks.useDetail;

const userReviewsHooks = createCrudHooks("Review", queryKeys.userReviews, userReviewsService);
export const useUserReviews = userReviewsHooks.useList;
export const useUserReview = userReviewsHooks.useDetail;
export const useCreateUserReview = userReviewsHooks.useCreate;
export const useUpdateUserReview = userReviewsHooks.useUpdate;
export const useDeleteUserReview = userReviewsHooks.useDelete;

const userCommentsHooks = createCrudHooks("Comment", queryKeys.userComments, userCommentsService);
export const useUserComments = userCommentsHooks.useList;
export const useUserComment = userCommentsHooks.useDetail;
export const useCreateUserComment = userCommentsHooks.useCreate;
export const useUpdateUserComment = userCommentsHooks.useUpdate;
export const useDeleteUserComment = userCommentsHooks.useDelete;

const countriesHooks = createCrudHooks("Country", queryKeys.countries, countriesService);
export const useCountries = countriesHooks.useList;
export const useCountry = countriesHooks.useDetail;
export const useCreateCountry = countriesHooks.useCreate;
export const useUpdateCountry = countriesHooks.useUpdate;
export const useDeleteCountry = countriesHooks.useDelete;

const statesHooks = createCrudHooks("State", queryKeys.states, statesService);
export const useStates = statesHooks.useList;
export const useState = statesHooks.useDetail;
export const useCreateState = statesHooks.useCreate;
export const useUpdateState = statesHooks.useUpdate;
export const useDeleteState = statesHooks.useDelete;

const citiesHooks = createCrudHooks("City", queryKeys.cities, citiesService);
export const useCities = citiesHooks.useList;
export const useCity = citiesHooks.useDetail;
export const useCreateCity = citiesHooks.useCreate;
export const useUpdateCity = citiesHooks.useUpdate;
export const useDeleteCity = citiesHooks.useDelete;

const continentsHooks = createCrudHooks("Continent", queryKeys.continents, continentsService);
export const useContinents = continentsHooks.useList;
export const useContinent = continentsHooks.useDetail;
export const useCreateContinent = continentsHooks.useCreate;
export const useUpdateContinent = continentsHooks.useUpdate;
export const useDeleteContinent = continentsHooks.useDelete;

const areasHooks = createCrudHooks("Area", queryKeys.areas, areasService);
export const useAreas = areasHooks.useList;
export const useArea = areasHooks.useDetail;
export const useCreateArea = areasHooks.useCreate;
export const useUpdateArea = areasHooks.useUpdate;
export const useDeleteArea = areasHooks.useDelete;

const contentCategoriesHooks = createCrudHooks(
  "Category",
  queryKeys.contentCategories,
  contentCategoriesService,
);
export const useContentCategories = contentCategoriesHooks.useList;
export const useContentCategory = contentCategoriesHooks.useDetail;
export const useCreateContentCategory = contentCategoriesHooks.useCreate;
export const useUpdateContentCategory = contentCategoriesHooks.useUpdate;
export const useDeleteContentCategory = contentCategoriesHooks.useDelete;

const seoRedirectsHooks = createCrudHooks("Redirect", queryKeys.seoRedirects, settingsService.seoRedirects);
export const useSeoRedirects = seoRedirectsHooks.useList;
export const useSeoRedirect = seoRedirectsHooks.useDetail;
export const useCreateSeoRedirect = seoRedirectsHooks.useCreate;
export const useUpdateSeoRedirect = seoRedirectsHooks.useUpdate;
export const useDeleteSeoRedirect = seoRedirectsHooks.useDelete;

const seoLandingPagesHooks = createCrudHooks(
  "Landing page",
  queryKeys.seoLandingPages,
  settingsService.seoLandingPages,
);
export const useSeoLandingPages = seoLandingPagesHooks.useList;
export const useSeoLandingPage = seoLandingPagesHooks.useDetail;
export const useCreateSeoLandingPage = seoLandingPagesHooks.useCreate;
export const useUpdateSeoLandingPage = seoLandingPagesHooks.useUpdate;
export const useDeleteSeoLandingPage = seoLandingPagesHooks.useDelete;

const languagesHooks = createCrudHooks("Language", queryKeys.supportedLanguages, settingsService.languages);
export const useSupportedLanguages = languagesHooks.useList;
export const useSupportedLanguage = languagesHooks.useDetail;
export const useCreateSupportedLanguage = languagesHooks.useCreate;
export const useUpdateSupportedLanguage = languagesHooks.useUpdate;
export const useDeleteSupportedLanguage = languagesHooks.useDelete;

const mediaTypesHooks = createCrudHooks(
  "Media type",
  queryKeys.supportedMediaTypes,
  settingsService.mediaTypes,
);
export const useSupportedMediaTypes = mediaTypesHooks.useList;
export const useSupportedMediaType = mediaTypesHooks.useDetail;
export const useCreateSupportedMediaType = mediaTypesHooks.useCreate;
export const useUpdateSupportedMediaType = mediaTypesHooks.useUpdate;
export const useDeleteSupportedMediaType = mediaTypesHooks.useDelete;

const contentStatusesHooks = createCrudHooks(
  "Content status",
  queryKeys.supportedContentStatuses,
  settingsService.contentStatuses,
);
export const useSupportedContentStatuses = contentStatusesHooks.useList;
export const useSupportedContentStatus = contentStatusesHooks.useDetail;
export const useCreateSupportedContentStatus = contentStatusesHooks.useCreate;
export const useUpdateSupportedContentStatus = contentStatusesHooks.useUpdate;
export const useDeleteSupportedContentStatus = contentStatusesHooks.useDelete;

export function useFestivalRegions(festivalId: string) {
  const keys = queryKeys.festivalRegions(festivalId);
  return createCrudHooks("Festival region", keys, festivalRegionsService(festivalId));
}

export function useFestivalDates(festivalId: string) {
  const keys = queryKeys.festivalDates(festivalId);
  return createCrudHooks("Festival date", keys, festivalDatesService(festivalId));
}

export function useFestivalTempleMaps(festivalId: string) {
  const keys = queryKeys.festivalTempleMaps(festivalId);
  return createCrudHooks("Temple map", keys, festivalTempleMapsService(festivalId));
}
