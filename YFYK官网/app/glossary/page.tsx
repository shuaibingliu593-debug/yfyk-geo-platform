import type { Metadata } from "next";
import "./glossary.css";
import { GlossaryOverview } from "@/components/glossary/GlossaryOverview";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { glossaryMeta } from "@/lib/content/glossary";
import { getGlossarySchemas } from "@/lib/schema/glossary";

export const metadata: Metadata = {
  title: glossaryMeta.title,
  description: glossaryMeta.description,
  alternates: {
    canonical: glossaryMeta.path,
    types: {
      "text/markdown": `${glossaryMeta.path}.md`,
    },
  },
  openGraph: {
    title: glossaryMeta.title,
    description: glossaryMeta.description,
    url: glossaryMeta.path,
    type: "website",
    locale: "zh_CN",
  },
};

export default function GlossaryPage() {
  return (
    <>
      <SchemaInjector id="yfyk-glossary-schema" schemas={getGlossarySchemas()} />
      <GlossaryOverview />
    </>
  );
}
