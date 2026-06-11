import type { Metadata } from "next";
import "./contact.css";
import { ContactOverview } from "@/components/contact/ContactOverview";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { MotionEnhancer } from "@/components/ui/MotionEnhancer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { contactMeta } from "@/lib/content/contact";
import { getContactPageSchemas } from "@/lib/schema/contact";

export const metadata: Metadata = {
  title: contactMeta.title,
  description: contactMeta.description,
  alternates: {
    canonical: contactMeta.path,
    types: {
      "text/markdown": `${contactMeta.path}.md`,
    },
  },
  openGraph: {
    title: contactMeta.title,
    description: contactMeta.description,
    url: contactMeta.path,
    type: "website",
    locale: "zh_CN",
  },
};

export default function ContactPage() {
  return (
    <>
      <SchemaInjector id="yfyk-contact-page-schema" schemas={getContactPageSchemas()} />
      <MotionEnhancer />
      <ScrollToTop />
      <ContactOverview />
    </>
  );
}
