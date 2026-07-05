"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  transition?: boolean;
};

const maxWidthClass = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
} as const;

const paddingClass = {
  none: "",
  sm: "px-4 py-4",
  md: "px-4 py-6 sm:px-6",
  lg: "px-4 py-8 sm:px-6 lg:px-8",
} as const;

export function PageShell({
  children,
  className,
  centered = false,
  maxWidth = "xl",
  padding = "md",
  transition = true,
}: PageShellProps) {
  const content = (
    <motion.div
      initial={transition ? { opacity: 0, y: 8 } : false}
      animate={transition ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mx-auto w-full",
        maxWidthClass[maxWidth],
        paddingClass[padding],
        centered && "flex min-h-svh items-center justify-center p-6",
        className,
      )}
    >
      {children}
    </motion.div>
  );

  return content;
}

export const PageWrapper = PageShell;
