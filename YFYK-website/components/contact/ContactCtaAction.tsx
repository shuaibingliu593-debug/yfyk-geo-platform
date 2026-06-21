"use client";

import Link from "next/link";
import { OpenContactModalLink } from "@/components/contact/OpenContactModalLink";
import { isContactModalHref } from "@/lib/contact-cta";

type ContactCtaActionProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  sourceModule?: string;
};

export function ContactCtaAction({ href, className, children, sourceModule }: ContactCtaActionProps) {
  if (isContactModalHref(href)) {
    return (
      <OpenContactModalLink className={className} sourceModule={sourceModule}>
        {children}
      </OpenContactModalLink>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
