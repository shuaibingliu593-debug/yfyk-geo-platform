"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ANIMATION_MS = 300;

type EditorDrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function EditorDrawer({ open, title, onClose, children, className }: EditorDrawerProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setIsVisible(false);
    const timer = window.setTimeout(() => setShouldRender(false), ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="关闭编辑面板"
        className={cn(
          "absolute inset-0 bg-foreground/20 backdrop-blur-[1px] transition-opacity duration-300 ease-out motion-reduce:transition-none",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        type="button"
        onClick={onClose}
      />
      <aside
        aria-labelledby="editor-drawer-title"
        aria-modal="true"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none",
          isVisible ? "translate-x-0" : "translate-x-full",
          className
        )}
        role="dialog"
      >
        <div className="flex min-w-0 items-center justify-between border-b border-border/80 px-6 py-4">
          <h2 className="min-w-0 flex-1 break-words pr-4 text-base font-semibold" id="editor-drawer-title">
            {title}
          </h2>
          <Button aria-label="关闭" className="h-8 w-8 p-0" type="button" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-5">{children}</div>
      </aside>
    </div>
  );
}
