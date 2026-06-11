import { IsOptional, IsString } from "class-validator";
import { Prisma } from "@prisma/client";

export class UpdateSchemaConfigDto {
  @IsOptional()
  @IsString()
  schemaType?: string | null;

  @IsOptional()
  schemaJson?: Prisma.InputJsonValue | null;
}
