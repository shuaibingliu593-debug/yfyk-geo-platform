"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GlossaryDrawer } from "@/components/glossary/GlossaryDrawer";
import { GlossaryRelationDiagram } from "@/components/glossary/GlossaryRelationDiagram";
import { GlossaryTermTable } from "@/components/glossary/GlossaryTermTable";
import { Icon } from "@/components/ui/Icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import {
  filterGlossaryTerms,
  getGlossaryTerm,
  glossaryCategories,
  glossaryHeroTags,
  glossaryRelatedServices,
  glossaryTerms,
  type GlossaryCategoryFilter,
  type GlossaryTerm,
} from "@/lib/content/glossary";
import { siteConfig } from "@/lib/content/home";

function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`glossary-heading${center ? " is-center" : ""}`}>
      <p className="eyebrow">
        <span /> {eyebrow}
      </p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function GlossaryOverview() {
  const version = siteConfig.version;
  const [activeCategory, setActiveCategory] = useState<GlossaryCategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const termLabelMap = useMemo(
    () => new Map(glossaryTerms.map((term) => [term.id, term.nameZh])),
    [],
  );

  const getRelatedLabel = useCallback(
    (id: string) => termLabelMap.get(id) ?? id,
    [termLabelMap],
  );

  const filteredTerms = useMemo(
    () => filterGlossaryTerms(activeCategory, searchQuery),
    [activeCategory, searchQuery],
  );

  const openTerm = useCallback((term: GlossaryTerm) => {
    setSelectedTerm(term);
    setDrawerOpen(true);
    window.history.replaceState(null, "", `#${term.id}`);
  }, []);

  const openTermById = useCallback(
    (id: string) => {
      const term = getGlossaryTerm(id);
      if (term) openTerm(term);
    },
    [openTerm],
  );

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const term = getGlossaryTerm(hash);
      if (term) {
        setSelectedTerm(term);
        setDrawerOpen(true);
      }
    }
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="glossary-page">
        <AISection
          id="top"
          summary="统一解释 GEO、AI 搜索、结构化数据、知识资产与 MCP 等核心概念。"
          version={version}
        >
          <section className="glossary-hero">
            <div className="glossary-hero-bg" aria-hidden="true" />
            <div className="shell glossary-hero-inner">
              <div className="glossary-hero-copy">
                <p className="eyebrow light">
                  <span /> GLOSSARY
                </p>
                <h1>GEO 与 AI 搜索术语表</h1>
                <p>
                  统一解释生成式引擎优化、AI 可读性、结构化数据、知识资产与 MCP
                  等核心概念，帮助企业建立面向 AI 时代的统一语言体系。
                </p>
                <div className="glossary-hero-tags">
                  {glossaryHeroTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <GlossaryRelationDiagram />
            </div>
          </section>
        </AISection>

        <AISection
          id="search"
          summary="按术语名称、英文名称或定义快速检索。"
          version={version}
        >
          <section className="glossary-band is-soft">
            <div className="shell">
              <SectionHeading
                eyebrow="SEARCH"
                title="快速查找术语"
                center
              />
              <div className="glossary-search-wrap">
                <label className="glossary-search" htmlFor="glossary-search-input">
                  <Icon name="scan" size={18} />
                  <input
                    id="glossary-search-input"
                    type="search"
                    value={searchQuery}
                    placeholder="搜索 GEO、Schema、llms.txt、MCP..."
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </label>
              </div>
            </div>
          </section>
        </AISection>

        <AISection
          id="terms-list"
          summary="按 GEO 基础、AI 搜索等主题浏览术语，查看 YFYK 常用核心概念。"
          version={version}
        >
          <section className="glossary-band glossary-browse-band">
            <div className="shell glossary-browse-stack">
              <SectionHeading eyebrow="BROWSE BY TOPIC" title="按主题浏览术语" />
              <div className="glossary-tabs-scroll" role="tablist" aria-label="术语分类">
                <div className="glossary-tabs">
                  {glossaryCategories.map((category) => {
                    const isActive = activeCategory === category.value;
                    return (
                      <button
                        key={category.value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`glossary-tab${isActive ? " is-active" : ""}`}
                        onClick={() => setActiveCategory(category.value)}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <GlossaryTermTable
                terms={filteredTerms}
                onSelect={openTerm}
                getRelatedLabel={getRelatedLabel}
              />
            </div>
          </section>
        </AISection>

        <AISection
          id="related-knowledge"
          summary="继续了解 GEO 原生建站、老站升级与企业知识库工程。"
          version={version}
        >
          <section className="glossary-band is-soft">
            <div className="shell">
              <SectionHeading
                eyebrow="LEARN MORE"
                title="继续了解 GEO 知识体系"
              />
              <div className="glossary-service-grid">
                {glossaryRelatedServices.map((item, index) => (
                  <article className="glossary-service-card" key={item.id}>
                    <span>0{index + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <Link href={item.href}>
                      {item.buttonLabel} <Icon name="arrow" size={15} />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </AISection>

        <AISection
          id="contact-cta"
          summary="帮助企业建设术语体系、FAQ 体系与 AI 可读内容架构。"
          version={version}
        >
          <SubpageFinalCta
            eyebrow="UNIFIED LANGUAGE"
            title="统一企业语言，让 AI 更准确理解你的业务"
            description="YFYK 帮助企业建设术语体系、FAQ 体系与 AI 可读内容架构，让官网成为可信知识源。"
            primaryButton={{ label: "咨询 GEO 方案", openContactModal: true }}
            secondaryButton={{ label: "预约免费诊断", openContactModal: true }}
          />
        </AISection>
      </main>

      <GlossaryDrawer
        term={selectedTerm}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onRelatedSelect={openTermById}
        getRelatedLabel={getRelatedLabel}
      />

      <SiteFooter />
    </>
  );
}
