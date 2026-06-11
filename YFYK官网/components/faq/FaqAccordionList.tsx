"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { faqCategoryLabels, type FaqItem } from "@/lib/content/faq";

interface FaqAccordionListProps {
  items: FaqItem[];
}

export function FaqAccordionList({ items }: FaqAccordionListProps) {
  if (items.length === 0) {
    return (
      <div className="faq-empty" role="status">
        <p>未找到匹配的问题，请尝试其他关键词或浏览全部 FAQ。</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="faq-accordion">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="faq-accordion-item">
          <AccordionTrigger value={item.id} className="faq-accordion-trigger">
            <span className="faq-accordion-leading">
              <span className="faq-accordion-category">{faqCategoryLabels[item.category]}</span>
              <span className="faq-accordion-question">{item.question}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent value={item.id} className="faq-accordion-content">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
