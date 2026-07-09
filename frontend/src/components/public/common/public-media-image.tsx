"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { resolvePublicMediaUrl } from "@/utils/media-url";
import { cn } from "@/lib/utils";

export function PublicMediaImage({
  alt,
  className,
  fill,
  height,
  source,
  width,
}: {
  alt: string;
  className?: string;
  fill?: boolean;
  height?: number;
  source?: unknown;
  width?: number;
}) {
  const src = resolvePublicMediaUrl(source);

  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-muted text-muted-foreground",
          className,
        )}
      >
        <ImageIcon className="size-8 opacity-50" />
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        alt={alt}
        className={cn("object-cover", className)}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        src={src}
        unoptimized
      />
    );
  }

  return (
    <Image
      alt={alt}
      className={cn("rounded-xl object-cover", className)}
      height={height ?? 240}
      src={src}
      unoptimized
      width={width ?? 360}
    />
  );
}
