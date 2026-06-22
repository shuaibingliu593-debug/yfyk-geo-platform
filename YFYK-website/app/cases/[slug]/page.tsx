import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../case-detail.css";
import "../cases-center.css";
import { CaseDetailOverview } from "@/components/cases/CaseDetailOverview";
import {
  getCaseBySlug,
  getCases,
  mapApiCaseToDetail,
  mapRelatedCasesByCategory,
} from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

const resolveSlug = async ({ params }: Props) => (await params).slug;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const slug = await resolveSlug(props);
  const apiCase = await getCaseBySlug(slug);
  if (!apiCase) return {};

  const detail = mapApiCaseToDetail(apiCase);
  return {
    title: `${detail.title} | 案例详情 | 优服优科`,
    description: detail.summary,
    alternates: { canonical: `/cases/${detail.slug}` },
  };
}

export default async function CaseDetailPage(props: Props) {
  const slug = await resolveSlug(props);
  const [apiCase, allApiCases] = await Promise.all([getCaseBySlug(slug), getCases()]);
  if (!apiCase) notFound();

  const detail = mapApiCaseToDetail(apiCase);
  const relatedCases = mapRelatedCasesByCategory(apiCase, allApiCases);

  return <CaseDetailOverview detail={detail} relatedCases={relatedCases} />;
}
