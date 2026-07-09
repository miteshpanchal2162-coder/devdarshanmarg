"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appToast } from "@/components/ui/sonner";
import { getApiErrorMessage } from "@/services/api-client";
import { meService } from "@/services/me.service";
import type { BaseQueryParams } from "@/types/api";

export const meQueryKeys = {
  all: ["me"] as const,
  profile: ["me", "profile"] as const,
  authProfile: ["me", "auth-profile"] as const,
  favorites: (params?: unknown) => ["me", "favorites", params] as const,
  ratings: (params?: unknown) => ["me", "ratings", params] as const,
  reviews: (params?: unknown) => ["me", "reviews", params] as const,
  comments: (params?: unknown) => ["me", "comments", params] as const,
  sessions: (params?: unknown) => ["me", "sessions", params] as const,
  notificationPreferences: ["me", "notification-preferences"] as const,
};

export function useMeProfile(enabled = true) {
  return useQuery({
    queryKey: meQueryKeys.profile,
    queryFn: () => meService.getProfile(),
    enabled,
  });
}

export function useAuthProfile(enabled = true) {
  return useQuery({
    queryKey: meQueryKeys.authProfile,
    queryFn: () => meService.getAuthProfile(),
    enabled,
  });
}

export function useUpdateMeProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => meService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKeys.all });
      appToast.success("Profile updated");
    },
    onError: (error) => appToast.error("Update failed", getApiErrorMessage(error)),
  });
}

export function useMeFavorites(params?: BaseQueryParams) {
  return useQuery({
    queryKey: meQueryKeys.favorites(params),
    queryFn: () => meService.favorites.list(params),
  });
}

export function useCreateFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: meService.favorites.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKeys.favorites() });
      appToast.success("Added to favorites");
    },
    onError: (error) => appToast.error("Failed to favorite", getApiErrorMessage(error)),
  });
}

export function useDeleteFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: meService.favorites.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKeys.favorites() });
      appToast.success("Removed from favorites");
    },
    onError: (error) => appToast.error("Failed to remove favorite", getApiErrorMessage(error)),
  });
}

export function useMeRatings(params?: BaseQueryParams) {
  return useQuery({
    queryKey: meQueryKeys.ratings(params),
    queryFn: () => meService.ratings.list(params),
  });
}

export function useMeReviews(params?: BaseQueryParams) {
  return useQuery({
    queryKey: meQueryKeys.reviews(params),
    queryFn: () => meService.reviews.list(params),
  });
}

export function useMeComments(params?: BaseQueryParams) {
  return useQuery({
    queryKey: meQueryKeys.comments(params),
    queryFn: () => meService.comments.list(params),
  });
}

export function useMeSessions(params?: BaseQueryParams) {
  return useQuery({
    queryKey: meQueryKeys.sessions(params),
    queryFn: () => meService.sessions.list(params),
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: meService.sessions.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKeys.sessions() });
      appToast.success("Session revoked");
    },
    onError: (error) => appToast.error("Failed to revoke session", getApiErrorMessage(error)),
  });
}

export function useLogoutAllSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => meService.sessions.logoutAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKeys.sessions() });
      appToast.success("Logged out from all devices");
    },
    onError: (error) => appToast.error("Logout failed", getApiErrorMessage(error)),
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: meQueryKeys.notificationPreferences,
    queryFn: () => meService.notificationPreferences.get(),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => meService.notificationPreferences.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKeys.notificationPreferences });
      appToast.success("Preferences saved");
    },
    onError: (error) => appToast.error("Failed to save preferences", getApiErrorMessage(error)),
  });
}
