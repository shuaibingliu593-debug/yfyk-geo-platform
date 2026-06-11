import { IsEnum, IsInt, IsOptional, IsString, Matches, Min } from "class-validator";
import { ResourceStatus, StaticResourceSourceType, StaticResourceType } from "@prisma/client";

export class CreateStaticResourceDto {
  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsString()
  resourceKey!: string;

  @IsEnum(StaticResourceType)
  resourceType!: StaticResourceType;

  @IsString()
  @Matches(/^\/.*/)
  url!: string;

  @IsEnum(StaticResourceSourceType)
  sourceType!: StaticResourceSourceType;

  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
