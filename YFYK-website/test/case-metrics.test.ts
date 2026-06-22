import assert from "node:assert/strict";
import test from "node:test";
import { parseCaseMetrics } from "../lib/case-metrics.ts";

test("preserves array order and appends units", () => {
  assert.deepEqual(parseCaseMetrics([
    { label: "AI引用率", value: "20", unit: "%" },
    { label: "GEO评分", value: 88, unit: "" },
  ]), [
    { label: "AI引用率", value: "20%" },
    { label: "GEO评分", value: "88" },
  ]);
});

test("drops incomplete metrics without reordering valid entries", () => {
  assert.deepEqual(parseCaseMetrics([
    { label: "", value: "1", unit: "%" },
    { label: "可读取", value: "98", unit: "%" },
    { label: "空值", value: "" },
  ]), [{ label: "可读取", value: "98%" }]);
});

test("supports legacy key/value metrics", () => {
  assert.deepEqual(parseCaseMetrics({ "AI提及率": "52%", "GEO评分": 90 }), [
    { label: "AI提及率", value: "52%" },
    { label: "GEO评分", value: "90" },
  ]);
});

test("returns an empty list for unsupported values", () => {
  assert.deepEqual(parseCaseMetrics(null), []);
  assert.deepEqual(parseCaseMetrics("20%"), []);
  assert.deepEqual(parseCaseMetrics({ "AI引用率": { value: "", unit: "%" } }), []);
});
