import { IsBoolean } from "class-validator";

export class UpdateDetectionConfigDto {
  @IsBoolean()
  detectEnabled!: boolean;
}
