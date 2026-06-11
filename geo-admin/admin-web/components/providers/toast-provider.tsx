"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { subscribeToasts, type ToastItem } from "@/lib/toast";

export function ToastProvider() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToasts(setItems), []);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "rounded-lg border px-4 py-3 text-sm shadow-lg",
            item.type === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
            item.type === "error" && "border-red-200 bg-red-50 text-red-800",
            item.type === "info" && "border-border bg-white text-foreground"
          )}
          role="status"
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
