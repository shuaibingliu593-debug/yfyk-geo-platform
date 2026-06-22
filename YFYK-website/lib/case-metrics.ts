export type ParsedCaseMetric = { label: string; value: string };

/** Normalize current array metrics and legacy key/value metrics without changing order. */
export function parseCaseMetrics(metrics: unknown): ParsedCaseMetric[] {
  if (!metrics) return [];

  if (Array.isArray(metrics)) {
    return metrics
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const record = item as { label?: string; value?: string | number; unit?: string };
        const label = String(record.label ?? "").trim();
        const rawValue = String(record.value ?? "").trim();
        const unit = String(record.unit ?? "").trim();
        if (!label || !rawValue) return null;
        return { label, value: unit ? `${rawValue}${unit}` : rawValue };
      })
      .filter((item): item is ParsedCaseMetric => item !== null);
  }

  if (typeof metrics === "object") {
    return Object.entries(metrics as Record<string, unknown>)
      .map(([label, value]) => {
        const normalizedLabel = label.trim();
        const normalizedValue = String(value ?? "").trim();
        if (!normalizedLabel || !normalizedValue) return null;
        return { label: normalizedLabel, value: normalizedValue };
      })
      .filter((item): item is ParsedCaseMetric => item !== null);
  }

  return [];
}
