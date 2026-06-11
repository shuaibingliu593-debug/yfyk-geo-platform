/**
 * FAQ 内容生成与验收约束（SSOT）
 * 供 AI 生成、人工撰写与 check:faq-content 脚本共用。
 */

export const FAQ_ANSWER_MIN_LENGTH = 100;
export const FAQ_ANSWER_MAX_LENGTH = 250;

export const FAQ_PRIORITY_SHARE = {
  decision: { min: 0.6, label: "A", name: "真实业务决策问题" },
  delivery: { target: 0.2, label: "B", name: "实施与交付问题" },
  concept: { max: 0.2, label: "C", name: "概念解释问题" }
} as const;

export const FAQ_TARGET_ROLES = [
  "企业老板",
  "市场负责人",
  "品牌负责人",
  "企业数字化负责人",
  "IT负责人",
  "网站负责人",
  "销售负责人"
] as const;

export const FAQ_DECISION_TOPICS = [
  "是否值得做",
  "为什么要做",
  "什么时候做",
  "怎么做",
  "成本和周期",
  "风险是什么",
  "与现有方案有什么区别",
  "能带来什么结果",
  "是否适合自己企业"
] as const;

export const FAQ_PRIORITY_A_EXAMPLES = [
  "GEO 适合哪些企业？",
  "企业什么时候应该启动 GEO 建设？",
  "老网站升级还是重新建设更合适？",
  "企业知识库应该从哪里开始建设？",
  "MCP 第一阶段是否有必要投入？",
  "如何判断官网是否已经适配 AI 搜索？",
  "企业做 GEO 多久能看到效果？",
  "FAQ 建设对 AI 引用有什么帮助？",
  "如何衡量 GEO 项目的效果？",
  "官网上线后还需要持续维护吗？"
] as const;

export const FAQ_PRIORITY_B_EXAMPLES = [
  "项目周期一般多久？",
  "企业需要准备哪些资料？",
  "是否影响现有网站运行？",
  "多语言网站如何处理？",
  "内容更新如何管理？",
  "后期维护成本高吗？"
] as const;

export const FAQ_PRIORITY_C_EXAMPLES = [
  "什么是 GEO？",
  "什么是 AI Summary？",
  "什么是 MCP？",
  "什么是 Schema？"
] as const;

export const FAQ_BANNED_PHRASES = ["简单来说", "通俗地讲", "举个例子"] as const;

export const FAQ_CONCEPT_QUESTION_PATTERNS: RegExp[] = [
  /^什么是/,
  /的定义是什么/,
  /的概念(是什么|介绍)/,
  /^.+是什么$/
];

export const FAQ_DELIVERY_QUESTION_PATTERNS: RegExp[] = [
  /周期/,
  /准备哪些资料/,
  /影响现有/,
  /多语言/,
  /内容更新/,
  /维护成本/,
  /交付/,
  /需要准备/
];

export type FaqPriorityTier = "decision" | "delivery" | "concept";

export type FaqContentItem = {
  question: string;
  answer: string;
};

export type FaqContentIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export function classifyFaqQuestion(question: string): FaqPriorityTier {
  const normalized = question.trim();
  if (FAQ_CONCEPT_QUESTION_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return "concept";
  }
  if (FAQ_DELIVERY_QUESTION_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return "delivery";
  }
  return "decision";
}

export function validateFaqItem(item: FaqContentItem): FaqContentIssue[] {
  const issues: FaqContentIssue[] = [];
  const question = item.question.trim();
  const answer = item.answer.trim();
  const answerLength = [...answer].length;

  if (!question) {
    issues.push({ code: "empty_question", message: "问题不能为空", severity: "error" });
  }

  if (!answer) {
    issues.push({ code: "empty_answer", message: "答案不能为空", severity: "error" });
    return issues;
  }

  if (answerLength < FAQ_ANSWER_MIN_LENGTH) {
    issues.push({
      code: "answer_too_short",
      message: `答案 ${answerLength} 字，低于 ${FAQ_ANSWER_MIN_LENGTH} 字下限`,
      severity: "error"
    });
  }

  if (answerLength > FAQ_ANSWER_MAX_LENGTH) {
    issues.push({
      code: "answer_too_long",
      message: `答案 ${answerLength} 字，超过 ${FAQ_ANSWER_MAX_LENGTH} 字上限`,
      severity: "error"
    });
  }

  for (const phrase of FAQ_BANNED_PHRASES) {
    if (answer.includes(phrase)) {
      issues.push({
        code: "banned_phrase",
        message: `答案包含禁用表述「${phrase}」`,
        severity: "error"
      });
    }
  }

  if (classifyFaqQuestion(question) === "concept") {
    issues.push({
      code: "concept_question",
      message: "问题属于概念解释类（优先级 C），批量生成时占比不得超过 20%",
      severity: "warning"
    });
  }

  return issues;
}

export function validateFaqBatch(items: FaqContentItem[]): FaqContentIssue[] {
  const issues: FaqContentIssue[] = [];
  if (items.length === 0) {
    return issues;
  }

  const counts = { decision: 0, delivery: 0, concept: 0 };
  for (const item of items) {
    counts[classifyFaqQuestion(item.question)] += 1;
  }

  const total = items.length;
  const decisionShare = counts.decision / total;
  const conceptShare = counts.concept / total;

  if (decisionShare < FAQ_PRIORITY_SHARE.decision.min) {
    issues.push({
      code: "decision_share_low",
      message: `优先级 A 占比 ${(decisionShare * 100).toFixed(1)}%，低于 ${FAQ_PRIORITY_SHARE.decision.min * 100}% 下限`,
      severity: "error"
    });
  }

  if (conceptShare > FAQ_PRIORITY_SHARE.concept.max) {
    issues.push({
      code: "concept_share_high",
      message: `概念解释类占比 ${(conceptShare * 100).toFixed(1)}%，超过 ${FAQ_PRIORITY_SHARE.concept.max * 100}% 上限`,
      severity: "error"
    });
  }

  return issues;
}

export const FAQ_GENERATION_PROMPT = `# FAQ 生成约束

## 核心原则
FAQ 必须优先回答用户真正关心的问题。生成时不要从技术概念出发。

## 目标角色
从以下角色的真实决策问题出发：
${FAQ_TARGET_ROLES.map((role, index) => `${index + 1}. ${role}`).join("\n")}

## 必须优先解决的问题类型
${FAQ_DECISION_TOPICS.map((topic) => `- ${topic}`).join("\n")}

## 避免大量生成（总占比不得超过 20%）
- 什么是 XXX
- XXX 的定义是什么
- XXX 的概念介绍

## 价值优先级
### 优先级 A（至少 60%）— 真实业务决策问题
${FAQ_PRIORITY_A_EXAMPLES.map((item) => `- ${item}`).join("\n")}

### 优先级 B（约 20%）— 实施与交付问题
${FAQ_PRIORITY_B_EXAMPLES.map((item) => `- ${item}`).join("\n")}

### 优先级 C（约 20%）— 概念解释问题
${FAQ_PRIORITY_C_EXAMPLES.map((item) => `- ${item}`).join("\n")}

## 答案要求
- 不要写教材、百科或技术文档
- 回答应像企业顾问、数字化负责人、解决方案架构师在向企业客户解释问题
- ${FAQ_ANSWER_MIN_LENGTH}~${FAQ_ANSWER_MAX_LENGTH} 字
- 先给结论，再解释原因，最后给建议
- 禁用：${FAQ_BANNED_PHRASES.map((item) => `「${item}」`).join("、")}
- 保持专业、克制、可信
`.trim();
