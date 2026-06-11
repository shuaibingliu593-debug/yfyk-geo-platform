"use client";

import Link from "next/link";
import { OpenContactModalLink } from "@/components/contact/OpenContactModalLink";
import { Icon } from "@/components/ui/Icons";
import { isContactModalHref } from "@/lib/contact-cta";
import "./subpage-final-cta.css";

export interface SubpageFinalCtaButton {
  label: string;
  href?: string;
  openContactModal?: boolean;
  sourceModule?: string;
}

export interface SubpageFinalCtaProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryButton: SubpageFinalCtaButton;
  secondaryButton: SubpageFinalCtaButton;
  sourceModule?: string;
}

function FinalCtaButton({
  button,
  className,
  iconSize,
  sectionSourceModule,
}: {
  button: SubpageFinalCtaButton;
  className: string;
  iconSize: number;
  sectionSourceModule?: string;
}) {
  const href = button.href ?? "/contact";
  const sourceModule = button.sourceModule ?? sectionSourceModule;

  if (button.openContactModal || isContactModalHref(href)) {
    return (
      <OpenContactModalLink
        className={className}
        sourceModule={sourceModule}
        sourceButtonText={button.label}
      >
        {button.label} <Icon name="arrow" size={iconSize} />
      </OpenContactModalLink>
    );
  }

  return (
    <Link className={className} href={href}>
      {button.label} <Icon name="arrow" size={iconSize} />
    </Link>
  );
}

export function SubpageFinalCta({
  eyebrow,
  title,
  description,
  primaryButton,
  secondaryButton,
  sourceModule,
}: SubpageFinalCtaProps) {
  return (
    <section className="subpage-final-cta">
      <div className="shell subpage-final-inner" data-reveal>
        <div className="subpage-final-copy">
          <p className="eyebrow light">
            <span /> {eyebrow}
          </p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="subpage-final-actions">
          <FinalCtaButton
            button={primaryButton}
            className="button"
            iconSize={17}
            sectionSourceModule={sourceModule}
          />
          <FinalCtaButton
            button={secondaryButton}
            className="subpage-final-secondary"
            iconSize={15}
            sectionSourceModule={sourceModule}
          />
        </div>
      </div>
    </section>
  );
}
