import { IsEnum, IsOptional, IsString } from "class-validator";
import { ContentStatus } from "@prisma/client";

export class ListNewsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
