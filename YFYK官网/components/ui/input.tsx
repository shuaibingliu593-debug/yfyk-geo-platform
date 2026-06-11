import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--ink)] shadow-sm transition-colors placeholder:text-[#98a2b3] focus-visible:border-[var(--blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,87,255,0.14)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
