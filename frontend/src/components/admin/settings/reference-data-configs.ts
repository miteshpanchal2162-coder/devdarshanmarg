"use client";

import type { ReferenceDataConfig } from "@/components/admin/settings/reference-data-management";
import {
  useCreateSupportedContentStatus,
  useCreateSupportedLanguage,
  useCreateSupportedMediaType,
  useDeleteSupportedContentStatus,
  useDeleteSupportedLanguage,
  useDeleteSupportedMediaType,
  useSupportedContentStatus,
  useSupportedContentStatuses,
  useSupportedLanguage,
  useSupportedLanguages,
  useSupportedMediaType,
  useSupportedMediaTypes,
  useUpdateSupportedContentStatus,
  useUpdateSupportedLanguage,
  useUpdateSupportedMediaType,
} from "@/hooks/queries/use-entities";

export const languagesConfig: ReferenceDataConfig = {
  entityLabel: "Supported Languages",
  basePath: "languages",
  nameField: "name",
  codeField: "isoCode",
  description: "Manage supported languages from the API.",
  formFields: [
    { name: "nativeName", label: "Native Name" },
    { name: "locale", label: "Locale" },
    { name: "sortOrder", label: "Sort Order", type: "number" },
  ],
  hooks: {
    useList: useSupportedLanguages,
    useDetail: useSupportedLanguage,
    useCreate: useCreateSupportedLanguage,
    useUpdate: useUpdateSupportedLanguage,
    useDelete: useDeleteSupportedLanguage,
  },
};

export const mediaTypesConfig: ReferenceDataConfig = {
  entityLabel: "Media Types",
  basePath: "media-types",
  nameField: "name",
  codeField: "slug",
  requireSlug: true,
  description: "Manage supported media types from the API.",
  formFields: [
    { name: "description", label: "Description", type: "textarea" },
    { name: "mimeType", label: "MIME Type" },
    { name: "sortOrder", label: "Sort Order", type: "number" },
  ],
  hooks: {
    useList: useSupportedMediaTypes,
    useDetail: useSupportedMediaType,
    useCreate: useCreateSupportedMediaType,
    useUpdate: useUpdateSupportedMediaType,
    useDelete: useDeleteSupportedMediaType,
  },
};

export const contentStatusesConfig: ReferenceDataConfig = {
  entityLabel: "Content Statuses",
  basePath: "content-types",
  nameField: "name",
  codeField: "slug",
  requireSlug: true,
  description: "Manage supported content statuses from the API.",
  formFields: [
    { name: "description", label: "Description", type: "textarea" },
    { name: "color", label: "Color" },
    { name: "sortOrder", label: "Sort Order", type: "number" },
  ],
  hooks: {
    useList: useSupportedContentStatuses,
    useDetail: useSupportedContentStatus,
    useCreate: useCreateSupportedContentStatus,
    useUpdate: useUpdateSupportedContentStatus,
    useDelete: useDeleteSupportedContentStatus,
  },
};
