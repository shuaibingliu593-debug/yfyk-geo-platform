import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { HomeLink } from "@/components/ui/HomeLink";
import { siteConfig } from "@/lib/content/home";
import { getFooterMenuLinks, siteMenus } from "@/lib/content/navigation";

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={["footer-menu-column", className].filter(Boolean).join(" ")}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function FooterContactItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="footer-contact-item">
      <span className="footer-contact-label">{label}</span>
      <span className="footer-contact-value">{children}</span>
    </p>
  );
}

export function SiteFooter() {
  const navGroups = siteMenus.filter((group) => group.label !== "案例");

  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-menu-column footer-identity-column">
          <div className="footer-logo-row">
            <Link className="brand footer-brand" href="/">
              <BrandLogo variant="dark" />
            </Link>
          </div>
          <p className="footer-legal-name">{siteConfig.legalName}</p>
        </div>
        <div className="footer-menu-block">
          <nav className="footer-nav" aria-label="页脚导航">
            {navGroups.map((group) => (
              <FooterColumn key={group.label} title={group.label}>
                {getFooterMenuLinks(group).map((link) => (
                  <Link href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ))}
              </FooterColumn>
            ))}
          </nav>
          <FooterColumn title="联系方式" className="footer-contact-column">
            <address className="footer-contact">
              <FooterContactItem label="项目询价：">
                <a href={`tel:${siteConfig.hotline}`}>{siteConfig.hotline}</a>
              </FooterContactItem>
              <FooterContactItem label="技术咨询：">
                <a href={`tel:${siteConfig.mobile}`}>{siteConfig.mobile}</a>
              </FooterContactItem>
              <FooterContactItem label="业务邮箱：">
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </FooterContactItem>
              {siteConfig.addresses.map((address) => {
                const [label, detail = ""] = address.split("：");
                return (
                  <FooterContactItem key={address} label={`${label}：`}>
                    {detail}
                  </FooterContactItem>
                );
              })}
            </address>
          </FooterColumn>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 {siteConfig.legalName}</span>
        <a href={siteConfig.icpUrl} target="_blank" rel="noopener noreferrer">ICP备案号：{siteConfig.icpRecord}</a>
        {siteConfig.publicSecurityRecord ? <a href={siteConfig.publicSecurityUrl} target="_blank" rel="noopener noreferrer">公安备案号：{siteConfig.publicSecurityRecord}</a> : null}
        <time dateTime={siteConfig.dateModified} data-version={siteConfig.version}>更新于 2026-05-31</time>
        <span>AI Friendly Website · GEO · MCP</span>
      </div>
    </footer>
  );
}
