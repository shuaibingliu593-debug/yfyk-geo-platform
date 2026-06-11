import { IsBoolean, IsNumber, IsObject, IsOptional, IsString, Max, Min } from "class-validator";
import { Prisma } from "@prisma/client";

export class UpdateGeoConfigDto {
  @IsOptional()
  @IsString()
  aiSummary?: string;

  @IsOptional()
  @IsString()
  schemaType?: string;

  @IsOptional()
  @IsObject()
  schemaJson?: Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @IsOptional()
  @IsBoolean()
  llmsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  sitemapEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  sitemapPriority?: number;

  @IsOptional()
  @IsBoolean()
  detectEnabled?: boolean;
}
