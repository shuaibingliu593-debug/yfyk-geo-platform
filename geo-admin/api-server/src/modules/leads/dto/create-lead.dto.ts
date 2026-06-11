import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateLeadDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  contact!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  demandType!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  sourcePage!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sourcePageTitle?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  sourceModule!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sourceButtonText?: string;
}
