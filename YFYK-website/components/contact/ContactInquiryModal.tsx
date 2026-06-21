"use client";

import { useEffect } from "react";
import { ContactInquiryForm } from "@/components/contact/ContactInquiryForm";
import "./contact-inquiry-modal.css";

type ContactInquiryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ContactInquiryModal({ open, onOpenChange }: ContactInquiryModalProps) {
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
    <div className="contact-inquiry-modal" data-state="open">
      <button
        type="button"
        className="contact-inquiry-modal-overlay"
        aria-label="关闭留言弹窗"
        onClick={() => onOpenChange(false)}
      />
      <div
        className="contact-inquiry-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-inquiry-modal-title"
      >
        <button
          type="button"
          className="contact-inquiry-modal-close"
          aria-label="关闭"
          onClick={() => onOpenChange(false)}
        >
          ×
        </button>
        <ContactInquiryForm variant="modal" />
      </div>
    </div>
  );
}
