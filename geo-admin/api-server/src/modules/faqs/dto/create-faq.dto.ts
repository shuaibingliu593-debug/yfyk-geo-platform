import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export const faqStatusValues = ["draft", "published", "archived"] as const;
export const relatedServiceTypeValues = [
  "geo_native_website",
  "ai_friendly_upgrade",
  "enterprise_knowledge_base",
  "general"
] as const;

export type FaqStatusValue = (typeof faqStatusValues)[number];
export type RelatedServiceTypeValue = (typeof relatedServiceTypeValues)[number];

export class CreateFaqDto {
  @IsString()
  question!: string;

  @IsString()
  answer!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(relatedServiceTypeValues)
  relatedServiceType?: RelatedServiceTypeValue;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsIn(faqStatusValues)
  status?: FaqStatusValue;
}
