import type { MouseEvent } from "react";

export function createSamePageNavClickHandler(
  pathname: string,
  href: string,
  onBeforeNavigate?: () => void,
) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    onBeforeNavigate?.();

    const targetPath = href.split("#")[0] || "/";
    if (pathname !== targetPath) return;

    event.preventDefault();

    const hash = href.split("#")[1];
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}
