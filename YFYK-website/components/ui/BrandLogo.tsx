import { siteConfig } from "@/lib/content/home";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  variant?: "dark" | "light";
};

export function BrandLogo({ className = "", priority = false, variant = "dark" }: BrandLogoProps) {
  const src = variant === "light" ? siteConfig.logoSrcLight : siteConfig.logoSrc;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`brand-logo brand-logo--${variant} ${className}`.trim()}
      src={src}
      alt={siteConfig.logoAlt}
      width={siteConfig.logoWidth}
      height={siteConfig.logoHeight}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
