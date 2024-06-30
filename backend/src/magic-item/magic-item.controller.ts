import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { MagicItemService } from './magic-item.service';
import { CreateMagicItemDto } from './dto/create-magic-item.dto';

import { MagicItemQueryDto } from './dto/query.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Magic-item')
@Controller('magic-item')
export class MagicItemController {
  constructor(private readonly magicItemService: MagicItemService) {}

  @ApiOperation({ summary: 'Add  magic item' })
  @ApiResponse({ type: CreateMagicItemDto })
  @Post('add')
  async addMagicItem(@Body() createMagicItemDto: CreateMagicItemDto) {
    return await this.magicItemService.addMagicItem(createMagicItemDto);
  }

  @ApiOperation({
    summary: 'Get all  magic items .. ',
  })
  @ApiResponse({ type: CreateMagicItemDto, isArray: true })
  @ApiExtraModels(MagicItemQueryDto)
  @Get()
  findAll(@Query() query: MagicItemQueryDto) {
    return this.magicItemService.findAll(query);
  }

  @ApiOperation({
    summary: 'Get many  magic items by ids',
  })
  @ApiResponse({ type: CreateMagicItemDto, isArray: true })
  @Get('find-by-ids')
  findAllByIds(@Body() itemsIds: string[]) {
    return this.magicItemService.findAllByIds(itemsIds);
  }

  @ApiOperation({
    summary: 'Get calculating weights for many  magic items by ids',
  })
  @ApiResponse({ type: Number })
  @Post('calculating-weights')
  async calculatingWeights(@Body() itemsIds: string[]) {
    return await this.magicItemService.calculatingWeights(itemsIds);
  }

  @ApiOperation({
    summary: 'Get single  magic item by id',
  })
  @ApiResponse({ type: CreateMagicItemDto })
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.magicItemService.findOne(id);
  }
}
