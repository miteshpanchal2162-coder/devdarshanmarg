"use client";

import { Archive, CheckCircle2, RotateCcw, Send, Trash2, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmationAction = "delete" | "archive" | "publish" | "unpublish" | "restore";

const actionConfig: Record<
  ConfirmationAction,
  {
    title: string;
    description: string;
    confirmLabel: string;
    icon: ReactNode;
    variant: "primary" | "destructive" | "secondary";
  }
> = {
  delete: {
    title: "Delete item",
    description: "This action cannot be undone.",
    confirmLabel: "Delete",
    icon: <Trash2 />,
    variant: "destructive",
  },
  archive: {
    title: "Archive item",
    description: "This item will be moved to the archive.",
    confirmLabel: "Archive",
    icon: <Archive />,
    variant: "secondary",
  },
  publish: {
    title: "Publish item",
    description: "This item will become visible where publishing is enabled.",
    confirmLabel: "Publish",
    icon: <Send />,
    variant: "primary",
  },
  unpublish: {
    title: "Unpublish item",
    description: "This item will no longer be publicly available.",
    confirmLabel: "Unpublish",
    icon: <XCircle />,
    variant: "secondary",
  },
  restore: {
    title: "Restore item",
    description: "This item will be restored from its current state.",
    confirmLabel: "Restore",
    icon: <RotateCcw />,
    variant: "primary",
  },
};

export function ConfirmationDialog({
  action = "delete",
  open,
  onOpenChange,
  title,
  description,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  loading,
  onConfirm,
}: {
  action?: ConfirmationAction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
}) {
  const config = actionConfig[action];
  const resolvedTitle = title ?? config.title;
  const resolvedDescription = message ?? description ?? config.description;
  const resolvedConfirmLabel = confirmLabel ?? config.confirmLabel;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent loading={loading} size="sm">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-muted text-primary [&_svg]:size-5">
            {config.icon ?? <CheckCircle2 />}
          </div>
          <DialogTitle>{resolvedTitle}</DialogTitle>
          {resolvedDescription ? (
            <DialogDescription>{resolvedDescription}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogBody className="sr-only" scrollable={false}>
          Confirmation required
        </DialogBody>
        <DialogFooter>
          <Button disabled={loading} onClick={() => onOpenChange(false)} variant="outline">
            {cancelLabel}
          </Button>
          <Button
            loading={loading}
            onClick={onConfirm}
            variant={config.variant}
          >
            {resolvedConfirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
