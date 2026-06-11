"use client";

import { cn } from "@/lib/utils/cn";

export type ToastProps = {
  open: boolean;
  message: string;
  variant?: "success" | "error";
  onClose?: () => void;
};

export function Toast({ open, message, variant = "success", onClose }: ToastProps) {
  if (!open) return null;

  return (
    <div className="contact-toast-host" role="status" aria-live="polite">
      <div
        className={cn(
          "contact-toast",
          variant === "success" && "is-success",
          variant === "error" && "is-error",
        )}
      >
        <span>{message}</span>
        {onClose ? (
          <button type="button" className="contact-toast-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
