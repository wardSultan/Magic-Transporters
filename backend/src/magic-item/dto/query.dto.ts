import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class MagicItemQueryDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  @ApiPropertyOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  @ApiPropertyOptional()
  pageSize?: number = 10;
}
