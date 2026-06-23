import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  offset?: number;
}
