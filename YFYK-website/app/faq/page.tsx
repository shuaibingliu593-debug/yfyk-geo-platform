import type { Metadata } from "next";
import "./faq.css";
import { FaqOverview } from "@/components/faq/FaqOverview";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { MotionEnhancer } from "@/components/ui/MotionEnhancer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getFaqs, mapFaqsToItems } from "@/lib/api";
import { faqMeta } from "@/lib/content/faq";
import { getFaqPageSchemas } from "@/lib/schema/faq";

export const metadata: Metadata = {
  title: faqMeta.title,
  description: faqMeta.description,
  alternates: {
    canonical: faqMeta.path,
    types: {
      "text/markdown": `${faqMeta.path}.md`,
    },
  },
  openGraph: {
    title: faqMeta.title,
    description: faqMeta.description,
    url: faqMeta.path,
    type: "website",
    locale: "zh_CN",
  },
};

/** FAQ 由后台 API 动态提供，避免 build 时 API 不可用导致静态页为空 */
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const apiFaqs = await getFaqs();
  const faqItems = mapFaqsToItems(apiFaqs);

  if (faqItems.length === 0) {
    console.warn(
      "[faq] 未拉取到 FAQ 数据，请确认 api-server 已启动且已执行 prisma db seed。" +
        ` API: ${process.env.NEXT_PUBLIC_API_BASE_URL ?? "(未配置)"}`,
    );
  }

  return (
    <>
      <SchemaInjector id="yfyk-faq-page-schema" schemas={getFaqPageSchemas(faqItems)} />
      <MotionEnhancer />
      <ScrollToTop />
      <FaqOverview faqItems={faqItems} />
    </>
  );
}
