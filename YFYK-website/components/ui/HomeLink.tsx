"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { createSamePageNavClickHandler } from "@/lib/navigation/same-page-nav";

type HomeLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: "/";
};

export function HomeLink({ href = "/", onClick, ...props }: HomeLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        createSamePageNavClickHandler(pathname, href)(event);
      }}
    />
  );
}
