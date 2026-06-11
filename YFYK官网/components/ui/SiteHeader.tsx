"use client";

import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { HomeLink } from "@/components/ui/HomeLink";
import { navigation, siteConfig } from "@/lib/content/home";
import type { NavItem } from "@/lib/content/types";
import { createSamePageNavClickHandler } from "@/lib/navigation/same-page-nav";

function getNavItemHref(item: NavItem) {
  if (!item.groups?.length) return item.href;
  const firstGroup = item.groups[0];
  return firstGroup.href ?? firstGroup.links[0]?.href ?? item.href;
}

function blurActiveElement() {
  const active = document.activeElement;
  if (active instanceof HTMLElement) active.blur();
}

const PAGE_HERO_SELECTOR =
  ".hero, .about-hero, .geo-page-hero, .cases-page-hero, .case-library-hero, .case-detail-hero, .services-overview-hero, .brand-site-hero, .global-site-hero, .upgrade-hero, .knowledge-source-hero, main [class$='-hero']:not([class*='-hero-'])";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeMenus = () => {
    setOpenMenu(null);
    setIsOpen(false);
    blurActiveElement();
  };

  useEffect(() => {
    const updateHeader = () => {
      const hero = document.querySelector<HTMLElement>(PAGE_HERO_SELECTOR);
      setIsScrolled(window.scrollY > 12 || Boolean(hero && hero.getBoundingClientRect().bottom <= 76));
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, [pathname]);

  useEffect(() => {
    closeMenus();
  }, [pathname]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeMenus();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenus();
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const usesLightLogo = isScrolled;

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`} ref={headerRef}>
      <div className="shell header-inner">
        <HomeLink className="brand" aria-label={`${siteConfig.brand}首页`} onClick={closeMenus}>
          <BrandLogo priority variant={usesLightLogo ? "light" : "dark"} />
        </HomeLink>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
          <b className="sr-only">切换导航</b>
        </button>
        <nav id="primary-navigation" className={`primary-nav ${isOpen ? "is-open" : ""}`} aria-label="主导航">
          <ul>
            {navigation.map((item) => (
              <li
                className={`${item.groups ? "has-menu" : ""}${openMenu === item.label ? " is-menu-open" : ""}`}
                key={item.label}
              >
                <div className="nav-item-line">
                  <Link
                    href={getNavItemHref(item)}
                    onClick={createSamePageNavClickHandler(pathname, getNavItemHref(item), closeMenus)}
                  >
                    {item.label}
                  </Link>
                  {item.groups ? (
                    <button
                      className="submenu-toggle"
                      type="button"
                      aria-expanded={openMenu === item.label}
                      aria-label={`${openMenu === item.label ? "收起" : "展开"}${item.label}菜单`}
                      onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    >
                      <span className="sr-only">{openMenu === item.label ? "收起" : "展开"}</span>
                    </button>
                  ) : null}
                </div>
                {item.groups ? (
                  <div className={`mega-menu ${openMenu === item.label ? "is-open" : ""}`}>
                    <div className="mega-menu-inner">
                      <div className="mega-intro">
                        <small>EXPLORE YFYK</small>
                        <strong>{item.label}</strong>
                        {item.menuDescription ? <p>{item.menuDescription}</p> : null}
                      </div>
                      <div className="mega-grid">
                        {item.groups.map((group) => (
                          <div className="mega-group" key={group.title}>
                            {group.href ? <Link className="mega-title" href={group.href} onClick={closeMenus}>{group.title}</Link> : <span className="mega-title">{group.title}</span>}
                            {group.links.map((link) => (
                              <Link className={group.href ? "mega-sublink" : undefined} href={link.href} key={link.href} onClick={closeMenus}>{link.label}</Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <ContactCtaAction className="button button-small" href="/contact" sourceModule="site-header-cta">获取方案</ContactCtaAction>
        </nav>
      </div>
    </header>
  );
}
