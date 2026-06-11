"use client";

import { useEffect, useId, type ReactNode } from "react";
import "./drawer.css";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = "",
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className={`ui-drawer${className ? ` ${className}` : ""}`} data-state="open">
      <button
        type="button"
        className="ui-drawer-overlay"
        aria-label="关闭详情"
        onClick={() => onOpenChange(false)}
      />
      <div
        className="ui-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="ui-drawer-header">
          <div className="ui-drawer-header-copy">
            {title ? (
              <h2 id={titleId} className="ui-drawer-title">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descriptionId} className="ui-drawer-description">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="ui-drawer-close"
            aria-label="关闭"
            onClick={() => onOpenChange(false)}
          >
            ×
          </button>
        </div>
        <div className="ui-drawer-body">{children}</div>
      </div>
    </div>
  );
}
