import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";
import { faqStatusValues, FaqStatusValue, relatedServiceTypeValues, RelatedServiceTypeValue } from "./create-faq.dto";

export class UpdateFaqDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  answer?: string;

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
