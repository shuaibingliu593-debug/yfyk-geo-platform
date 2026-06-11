export interface ContentSection {
  id: string;
  aiChunk: string;
  title: string;
  body: string;
  summary?: string;
}

export interface BaseContent {
  id: string;
  metadata: {
    title: string;
    summary: string;
    dateModified: string;
    version: string;
  };
  sections: ContentSection[];
}

export interface GeoPageContent extends BaseContent {
  slug: string;
  path: string;
  description: string;
  knowsAbout: string[];
  pageType: "Service" | "CollectionPage" | "AboutPage" | "ContactPage" | "Article";
  templateKind: "aggregate" | "detail" | "editorial" | "company";
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  audience: string;
  painPoints: ContentCard[];
  capabilities: ContentCard[];
  professionalKnowledge: ContentCard[];
  visualAssets: VisualAsset[];
  deliverables: string[];
  processSteps: ContentCard[];
  faqs: FaqItem[];
  relatedPaths: string[];
  catalogGroups: Array<{
    title: string;
    description: string;
    paths: string[];
  }>;
  publicReferences: PublicReference[];
  terms: Array<{
    id: string;
    term: string;
    definition: string;
  }>;
  cta: {
    title: string;
    description: string;
    href: string;
    label: string;
  };
  chinaCompliance: string[];
  researchSources: string[];
}

export interface ContentCard {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PublicReference {
  title: string;
  description: string;
  url: string;
}

export interface VisualAsset {
  src: string;
  alt: string;
  caption: string;
}

export interface NavItem {
  label: string;
  href: string;
  menuDescription?: string;
  groups?: Array<{
    title: string;
    href?: string;
    links: Array<{ label: string; href: string }>;
  }>;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  features: string[];
}

export interface CaseStudy {
  id: string;
  slug: string;
  publicationStatus: "scenario" | "authorized";
  clientDisplayName: string;
  coverImage?: string;
  clientLogo?: string;
  clientLogoAlt?: string;
  industry: string;
  category: string;
  title: string;
  description: string;
  href: string;
  coreChallenge: string;
  outcomeSummary: string;
  background: string;
  relatedServicePaths: string[];
  highlights: string[];
  metrics?: Array<{
    label: string;
    value: string;
    note?: string;
  }>;
  trendData?: Array<{
    label: string;
    value: number;
  }>;
  aiCitationScreenshots?: Array<{
    src: string;
    alt: string;
    platform: string;
  }>;
  testimonial?: {
    quote: string;
    name: string;
    role: string;
    videoUrl?: string;
  };
}

export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  painPoint: string;
  quote: string;
  deliverables: string[];
}
