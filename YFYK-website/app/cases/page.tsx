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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CasesCenterPage() {
  const { data: apiCases, loadError } = await getCases().then(
    (data) => ({ data, loadError: false }),
    (error) => {
      console.error("[cases] failed to load:", error);
      return { data: [], loadError: true };
    },
  );
  const cases = mapCasesToCenterItems(apiCases);

  return (
    <>
      <SchemaInjector id="yfyk-cases-center-schema" schemas={getCasesCenterSchemas(cases)} />
      <MotionEnhancer />
      <ScrollToTop />
      <CasesCenterOverview cases={cases} loadError={loadError} />
    </>
  );
}
