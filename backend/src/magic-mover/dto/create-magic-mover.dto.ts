import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';
import { MagicItem } from '../../magic-item/entities/magic-item.schema';
import { QuestState } from '../entities/magic-mover.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMagicMoverDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  weightLimit: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  energy: number;

  @IsEnum(QuestState)
  @IsOptional()
  questState: string;

  @IsArray()
  @IsOptional()
  items?: MagicItem[];

  @IsNumber()
  @IsOptional()
  missionsCompleted?: number;
}
