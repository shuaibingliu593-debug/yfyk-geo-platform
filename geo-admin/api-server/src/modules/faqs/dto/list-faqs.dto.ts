import { IsIn, IsOptional, IsString } from "class-validator";
import { faqStatusValues, FaqStatusValue, relatedServiceTypeValues, RelatedServiceTypeValue } from "./create-faq.dto";

export class ListFaqsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(relatedServiceTypeValues)
  relatedServiceType?: RelatedServiceTypeValue;

  @IsOptional()
  @IsIn(relatedServiceTypeValues)
  related_service_type?: RelatedServiceTypeValue;

  @IsOptional()
  @IsIn(faqStatusValues)
  status?: FaqStatusValue;
}
