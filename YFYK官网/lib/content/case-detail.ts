/** 案例详情页视图模型，字段与后台 Case 一一对应 */
export interface CaseDetailMetric {
  label: string;
  value: string;
}

export interface CaseDetailView {
  slug: string;
  title: string;
  /** 案例分类（caseType 展示名） */
  category: string;
  /** 原始 caseType，用于同分类推荐 */
  caseType: string;
  industry: string;
  customerName: string;
  displayName: string;
  coverImage?: string;
  summary: string;
  challenge?: string;
  solution?: string;
  result?: string;
  metrics: CaseDetailMetric[];
  content: string;
}
