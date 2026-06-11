import { IsEnum, IsOptional, IsString } from "class-validator";
import { CaseType, ContentStatus } from "@prisma/client";

export class ListCasesDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(CaseType)
  caseType?: CaseType;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
