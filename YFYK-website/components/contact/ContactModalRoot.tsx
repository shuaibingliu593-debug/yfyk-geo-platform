"use client";

import { useEffect } from "react";
import "./contact-inquiry-modal.css";
import { ContactInquiryModal } from "@/components/contact/ContactInquiryModal";
import { ContactModalProvider, useContactModal } from "@/components/contact/ContactModalContext";
import { Toast } from "@/components/ui/toast";

function ContactInquiryModalHost() {
  const { open, closeContactModal } = useContactModal();
  return <ContactInquiryModal open={open} onOpenChange={(next) => !next && closeContactModal()} />;
}

function ContactToastHost() {
  const { toast, hideContactToast } = useContactModal();

  useEffect(() => {
    if (!toast.open) return;
    const timer = window.setTimeout(hideContactToast, 3000);
    return () => window.clearTimeout(timer);
  }, [toast.open, hideContactToast]);

  return (
    <Toast
      open={toast.open}
      message={toast.message}
      variant={toast.variant}
      onClose={hideContactToast}
    />
  );
}

export function ContactModalRoot({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      {children}
      <ContactInquiryModalHost />
      <ContactToastHost />
    </ContactModalProvider>
  );
}
