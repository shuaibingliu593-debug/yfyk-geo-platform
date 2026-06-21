import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full resize-y rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] shadow-sm transition-colors placeholder:text-[#98a2b3] focus-visible:border-[var(--blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,87,255,0.14)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
