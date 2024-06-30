import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Action } from 'src/activity-log/entities/activity-log.schema';

export class CreateActivityLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  magicMover: string;

  @ApiProperty()
  @IsEnum(Action)
  @IsNotEmpty()
  action: Action;

  @ApiProperty()
  @IsObject()
  details: Record<string, any>;
}
