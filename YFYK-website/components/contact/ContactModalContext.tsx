"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LeadSourceMeta } from "@/lib/lead-source";

type ContactToastState = {
  open: boolean;
  message: string;
  variant: "success" | "error";
};

const initialToastState: ContactToastState = {
  open: false,
  message: "",
  variant: "success",
};

type ContactModalContextValue = {
  open: boolean;
  source: LeadSourceMeta | null;
  toast: ContactToastState;
  openContactModal: (source?: LeadSourceMeta) => void;
  closeContactModal: () => void;
  showContactToast: (message: string, variant?: "success" | "error") => void;
  hideContactToast: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<LeadSourceMeta | null>(null);
  const [toast, setToast] = useState<ContactToastState>(initialToastState);

  const openContactModal = useCallback((nextSource?: LeadSourceMeta) => {
    setSource(nextSource ?? null);
    setOpen(true);
  }, []);

  const closeContactModal = useCallback(() => {
    setOpen(false);
    setSource(null);
  }, []);

  const showContactToast = useCallback((message: string, variant: "success" | "error" = "success") => {
    setToast({ open: true, message, variant });
  }, []);

  const hideContactToast = useCallback(() => {
    setToast(initialToastState);
  }, []);

  const value = useMemo(
    () => ({
      open,
      source,
      toast,
      openContactModal,
      closeContactModal,
      showContactToast,
      hideContactToast,
    }),
    [open, source, toast, openContactModal, closeContactModal, showContactToast, hideContactToast],
  );

  return <ContactModalContext.Provider value={value}>{children}</ContactModalContext.Provider>;
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return context;
}
