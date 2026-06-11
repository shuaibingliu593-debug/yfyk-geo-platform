import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FAQ_ANSWER_MAX_LENGTH,
  FAQ_ANSWER_MIN_LENGTH,
  FAQ_PRIORITY_SHARE,
  classifyFaqQuestion,
  validateFaqBatch,
  validateFaqItem
} from "../faq-content-guidelines.ts";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(rootDir, "..");
const errors = [];
const warnings = [];

function readText(relativePath) {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

function extractFaqItemsFromSeedSource(source) {
  const match = source.match(/export const faqSeedData: FaqSeedItem\[\] = (\[[\s\S]*?\n\]);/);
  if (!match) {
    throw new Error("Unable to locate faqSeedData array in prisma/faq-seed-data.ts");
  }

  const items = Function(`"use strict"; return (${match[1]});`)();
  return items.map((item) => ({ question: item.question, answer: item.answer }));
}

function pushIssue(issue, question) {
  const prefix = question ? `[${question}] ` : "";
  if (issue.severity === "error") {
    errors.push(`${prefix}${issue.message}`);
  } else {
    warnings.push(`${prefix}${issue.message}`);
  }
}

const faqSourcePath = "geo-admin/api-server/prisma/faq-seed-data.ts";
const faqItems = extractFaqItemsFromSeedSource(readText(faqSourcePath));

for (const item of faqItems) {
  for (const issue of validateFaqItem(item)) {
    pushIssue(issue, item.question);
  }
}

for (const issue of validateFaqBatch(faqItems)) {
  pushIssue(issue);
}

const tierCounts = { decision: 0, delivery: 0, concept: 0 };
for (const item of faqItems) {
  tierCounts[classifyFaqQuestion(item.question)] += 1;
}

const total = faqItems.length;
const distribution = Object.entries(tierCounts).map(([tier, count]) => {
  const share = total ? ((count / total) * 100).toFixed(1) : "0.0";
  return `${tier}: ${count} (${share}%)`;
});

console.log(`Checked ${total} FAQ items from ${faqSourcePath}`);
console.log(`Answer length target: ${FAQ_ANSWER_MIN_LENGTH}~${FAQ_ANSWER_MAX_LENGTH} 字`);
console.log(
  `Priority share target: A >= ${FAQ_PRIORITY_SHARE.decision.min * 100}%, C <= ${FAQ_PRIORITY_SHARE.concept.max * 100}%`
);
console.log(`Distribution: ${distribution.join(", ")}`);

if (warnings.length) {
  console.warn("\nWarnings:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log("\nFAQ content check passed.");
}
