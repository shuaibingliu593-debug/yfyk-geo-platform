import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full appearance-none rounded-xl border border-[var(--line)] bg-white px-4 pr-10 text-sm text-[var(--ink)] shadow-sm transition-colors focus-visible:border-[var(--blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,87,255,0.14)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#98a2b3]"
      >
        ▾
      </span>
    </div>
  ),
);
Select.displayName = "Select";
