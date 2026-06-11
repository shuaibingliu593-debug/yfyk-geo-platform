"use client";

import { Icon } from "@/components/ui/Icons";
import {
  glossaryCategoryLabels,
  type GlossaryTerm,
} from "@/lib/content/glossary";

interface GlossaryTermTableProps {
  terms: GlossaryTerm[];
  onSelect: (term: GlossaryTerm) => void;
  getRelatedLabel: (id: string) => string;
}

export function GlossaryTermTable({
  terms,
  onSelect,
  getRelatedLabel,
}: GlossaryTermTableProps) {
  if (terms.length === 0) {
    return (
      <div className="glossary-empty">
        <p>未找到匹配的术语，请尝试其他关键词或切换分类。</p>
      </div>
    );
  }

  return (
    <>
      <div className="glossary-table-wrap" role="region" aria-label="术语表格">
        <table className="glossary-table">
          <thead>
            <tr>
              <th scope="col">术语</th>
              <th scope="col">英文名称</th>
              <th scope="col">分类</th>
              <th scope="col">定义</th>
              <th scope="col">相关术语</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((term) => (
              <tr key={term.id}>
                <td data-label="术语">
                  <strong>{term.nameZh}</strong>
                </td>
                <td data-label="英文名称">{term.nameEn}</td>
                <td data-label="分类">
                  <span className="glossary-category-tag">
                    {glossaryCategoryLabels[term.category]}
                  </span>
                </td>
                <td data-label="定义">{term.definition}</td>
                <td data-label="相关术语">
                  <div className="glossary-related-tags">
                    {term.relatedTermIds.slice(0, 3).map((id) => (
                      <span key={id}>{getRelatedLabel(id)}</span>
                    ))}
                  </div>
                </td>
                <td data-label="操作">
                  <button
                    type="button"
                    className="glossary-table-action"
                    onClick={() => onSelect(term)}
                  >
                    了解更多 <Icon name="arrow" size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glossary-card-list" aria-label="术语卡片列表">
        {terms.map((term) => (
          <article className="glossary-card" key={term.id}>
            <div className="glossary-card-head">
              <div>
                <h3>{term.nameZh}</h3>
                <p>{term.nameEn}</p>
              </div>
              <span className="glossary-category-tag">
                {glossaryCategoryLabels[term.category]}
              </span>
            </div>
            <p className="glossary-card-definition">{term.definition}</p>
            <div className="glossary-related-tags">
              {term.relatedTermIds.slice(0, 3).map((id) => (
                <span key={id}>{getRelatedLabel(id)}</span>
              ))}
            </div>
            <button
              type="button"
              className="glossary-table-action"
              onClick={() => onSelect(term)}
            >
              了解更多 <Icon name="arrow" size={14} />
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
