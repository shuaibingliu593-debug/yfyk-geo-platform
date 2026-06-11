import type { Metadata } from "next";
import Link from "next/link";
import { CaseGallery } from "@/components/ui/CaseGallery";
import { MotionEnhancer } from "@/components/ui/MotionEnhancer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { siteConfig } from "@/lib/content/home";
import {
  caseLibraryCaseToGalleryItem,
  getCaseLibraryListPage,
  getCasesForList,
} from "@/lib/content/case-library";

const page = getCaseLibraryListPage("showcase")!;

export const metadata: Metadata = {
  title: `${page.title} | 优服优科`,
  description: page.description,
  alternates: { canonical: "/cases/showcase" },
};

export default function ShowcaseCasesPage() {
  const cases = getCasesForList(page).map(caseLibraryCaseToGalleryItem);
  const url = `${siteConfig.siteUrl}/cases/showcase`;

  return (
    <>
      <SiteHeader />
      <SchemaInjector
        id="schema-case-showcase"
        schemas={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${url}#webpage`,
            name: page.heading,
            description: page.description,
            url,
            dateModified: siteConfig.dateModified,
            version: siteConfig.version,
            inLanguage: "zh-CN",
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "@id": `${url}#cases`,
            name: page.heading,
            itemListElement: cases.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.title,
              url: `${siteConfig.siteUrl}${item.href}`,
            })),
          },
        ]}
      />
      <MotionEnhancer />
      <ScrollToTop />
      <main>
        <section className="cases section-pad" id="showcase-cases">
          <div className="shell">
            <div className="section-heading split">
              <div>
                <p className="eyebrow">
                  <span /> FEATURED CASES
                </p>
                <h2>{page.heading}</h2>
              </div>
              <p>{page.heroLead}</p>
            </div>
            <CaseGallery cases={cases} revealOnHover />
            <div className="case-more">
              <Link className="button" href={page.cta.href}>
                {page.cta.label}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
