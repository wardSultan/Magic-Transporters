import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class LoadItemsDto {
  @ApiProperty()
  @IsString()
  magicMoverId: string;

  @ApiProperty()
  @IsArray()
  itemsIds: string[];
}
