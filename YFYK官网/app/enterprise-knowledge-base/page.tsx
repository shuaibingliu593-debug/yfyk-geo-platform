import type { Metadata } from "next";
import "./enterprise-knowledge-base.css";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { EnterpriseKnowledgeBaseOverview } from "@/components/ui/EnterpriseKnowledgeBaseOverview";
import { ekbMeta } from "@/lib/content/enterprise-knowledge-base";
import { getEnterpriseKnowledgeBaseSchemas } from "@/lib/schema/enterprise-knowledge-base";

export const metadata: Metadata = {
  title: ekbMeta.title,
  description: ekbMeta.description,
  alternates: {
    canonical: ekbMeta.path,
    types: {
      "text/markdown": `${ekbMeta.path}.md`,
    },
  },
  openGraph: {
    title: ekbMeta.title,
    description: ekbMeta.description,
    url: ekbMeta.path,
    type: "website",
    locale: "zh_CN",
  },
};

export default function EnterpriseKnowledgeBasePage() {
  return (
    <>
      <SchemaInjector
        id="yfyk-enterprise-knowledge-base-schema"
        schemas={getEnterpriseKnowledgeBaseSchemas()}
      />
      <EnterpriseKnowledgeBaseOverview />
    </>
  );
}
