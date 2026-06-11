const HTML_TAG_RE = /<[^>]*>/g;

export function stripHtmlTags(value: string): string {
  return value.replace(HTML_TAG_RE, "");
}

export function sanitizeText(value: string | undefined | null, maxLength: number): string | undefined {
  if (value == null) return undefined;
  const trimmed = stripHtmlTags(String(value).trim());
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

export function sanitizeRequiredText(value: string, maxLength: number, fieldName: string): string {
  const sanitized = sanitizeText(value, maxLength);
  if (!sanitized) {
    throw new Error(`${fieldName} 不能为空`);
  }
  return sanitized;
}
