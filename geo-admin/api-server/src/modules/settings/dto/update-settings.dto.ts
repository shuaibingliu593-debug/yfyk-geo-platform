import { IsOptional, IsString } from "class-validator";

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  siteName?: string;

  @IsOptional()
  @IsString()
  siteUrl?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  defaultLanguage?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  crawlWeight?: number;

  @IsOptional()
  understandingWeight?: number;

  @IsOptional()
  structureWeight?: number;
}
