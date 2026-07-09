"use client";

import type { GeoEntityConfig } from "@/components/admin/geo/geo-entity-management";
import {
  useCities,
  useCity,
  useContentCategories,
  useContentCategory,
  useCountries,
  useCountry,
  useCreateCity,
  useCreateContentCategory,
  useCreateCountry,
  useCreateState,
  useDeleteCity,
  useDeleteContentCategory,
  useDeleteCountry,
  useDeleteState,
  useState as useStateEntity,
  useStates,
  useUpdateCity,
  useUpdateContentCategory,
  useUpdateCountry,
  useUpdateState,
} from "@/hooks/queries/use-entities";

export const countryConfig: GeoEntityConfig = {
  entityLabel: "Country",
  basePath: "countries",
  sectionLabel: "Geo",
  description: "Manage countries from the geo API.",
  nameField: "name",
  codeField: "iso2",
  formFields: [{ name: "iso3", label: "ISO3", required: true }],
  hooks: {
    useList: useCountries,
    useDetail: useCountry,
    useCreate: useCreateCountry,
    useUpdate: useUpdateCountry,
    useDelete: useDeleteCountry,
  },
};

export const stateConfig: GeoEntityConfig = {
  entityLabel: "State",
  basePath: "states",
  sectionLabel: "Geo",
  description: "Manage states and provinces from the geo API.",
  nameField: "name",
  codeField: "code",
  formFields: [
    { name: "countryId", label: "Country ID", required: true },
    { name: "capital", label: "Capital" },
  ],
  hooks: {
    useList: useStates,
    useDetail: useStateEntity,
    useCreate: useCreateState,
    useUpdate: useUpdateState,
    useDelete: useDeleteState,
  },
};

export const cityConfig: GeoEntityConfig = {
  entityLabel: "City",
  basePath: "cities",
  sectionLabel: "Geo",
  description: "Manage cities from the geo API.",
  nameField: "name",
  codeField: "slug",
  formFields: [
    { name: "countryId", label: "Country ID", required: true },
    { name: "stateId", label: "State ID", required: true },
    { name: "cityType", label: "City Type" },
  ],
  hooks: {
    useList: useCities,
    useDetail: useCity,
    useCreate: useCreateCity,
    useUpdate: useUpdateCity,
    useDelete: useDeleteCity,
  },
};

export const contentCategoryConfig: GeoEntityConfig = {
  entityLabel: "Content Category",
  basePath: "categories",
  sectionLabel: "Content",
  description: "Manage content categories from the content-categories API.",
  nameField: "name",
  codeField: "slug",
  includeSlug: false,
  formFields: [{ name: "description", label: "Description", type: "textarea" }],
  hooks: {
    useList: useContentCategories,
    useDetail: useContentCategory,
    useCreate: useCreateContentCategory,
    useUpdate: useUpdateContentCategory,
    useDelete: useDeleteContentCategory,
  },
};
