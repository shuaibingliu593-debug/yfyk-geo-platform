"use client";

import { useContactModal } from "@/components/contact/ContactModalContext";
import { extractButtonLabel, inferSourceModule } from "@/lib/lead-source";
import { usePathname } from "next/navigation";
import "./contact-inquiry-modal.css";

type OpenContactModalLinkProps = {
  className?: string;
  children: React.ReactNode;
  sourceModule?: string;
  sourceButtonText?: string;
};

export function OpenContactModalLink({
  className,
  children,
  sourceModule,
  sourceButtonText,
}: OpenContactModalLinkProps) {
  const { openContactModal } = useContactModal();
  const pathname = usePathname();

  const handleClick = () => {
    openContactModal({
      sourceModule: inferSourceModule(pathname, sourceModule),
      sourceButtonText: sourceButtonText ?? (extractButtonLabel(children) || "咨询"),
    });
  };

  return (
    <button
      type="button"
      className={`open-contact-modal-link${className ? ` ${className}` : ""}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
