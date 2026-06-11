import type { Metadata } from "next";
import "./patents.css";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { PatentsOverview } from "@/components/patents/PatentsOverview";
import { patentsMeta } from "@/lib/content/patents";
import { getPatentsSchemas } from "@/lib/schema/patents";

export const metadata: Metadata = {
  title: patentsMeta.title,
  description: patentsMeta.description,
  alternates: {
    canonical: patentsMeta.path,
    types: {
      "text/markdown": `${patentsMeta.path}.md`,
    },
  },
  openGraph: {
    title: patentsMeta.title,
    description: patentsMeta.description,
    url: patentsMeta.path,
    type: "website",
    locale: "zh_CN",
  },
};

export default function PatentsPage() {
  return (
    <>
      <SchemaInjector id="yfyk-patents-schema" schemas={getPatentsSchemas()} />
      <PatentsOverview />
    </>
  );
}
