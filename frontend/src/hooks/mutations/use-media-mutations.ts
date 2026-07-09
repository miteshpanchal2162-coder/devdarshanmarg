"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appToast } from "@/components/ui/sonner";
import { getApiErrorMessage } from "@/services/api-client";
import { mediaService } from "@/services/media.service";
import { queryKeys } from "@/hooks/queries/query-keys";

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      folder,
      altText,
      kind = "any",
    }: {
      file: File;
      folder: string;
      altText?: string;
      kind?: "image" | "document" | "any";
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      if (altText) formData.append("altText", altText);

      if (kind === "image") return mediaService.uploadImage(formData);
      if (kind === "document") return mediaService.uploadDocument(formData);
      return mediaService.upload(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.media.all });
      appToast.success("File uploaded");
    },
    onError: (error) => appToast.error("Upload failed", getApiErrorMessage(error)),
  });
}
