import type { Metadata } from "next";
import "./cases-center.css";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { CasesCenterOverview } from "@/components/ui/CasesCenterOverview";
import { MotionEnhancer } from "@/components/ui/MotionEnhancer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getCases, mapCasesToCenterItems } from "@/lib/api";
import { casesCenterMeta } from "@/lib/content/cases-center";
import { getCasesCenterSchemas } from "@/lib/schema/cases-center";

export const metadata: Metadata = {
  title: casesCenterMeta.title,
  description: casesCenterMeta.description,
  alternates: {
    canonical: casesCenterMeta.path,
    types: {
      "text/markdown": `${casesCenterMeta.path}.md`,
    },
  },
  openGraph: {
    title: casesCenterMeta.title,
    description: casesCenterMeta.description,
    url: casesCenterMeta.path,
    type: "website",
    locale: "zh_CN",
  },
};

/** 后台发布内容后约 60 秒内同步到官网 */
export const revalidate = 60;

export default async function CasesCenterPage() {
  const apiCases = await getCases();
  const cases = mapCasesToCenterItems(apiCases);

  return (
    <>
      <SchemaInjector id="yfyk-cases-center-schema" schemas={getCasesCenterSchemas(cases)} />
      <MotionEnhancer />
      <ScrollToTop />
      <CasesCenterOverview cases={cases} />
    </>
  );
}
