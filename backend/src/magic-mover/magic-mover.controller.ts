import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { MagicMoverService } from './magic-mover.service';
import { CreateMagicMoverDto } from './dto/create-magic-mover.dto';
import { MagicMover } from './entities/magic-mover.schema';
import { MagicMoverQueryDto } from './dto/query.dto';
import { LoadItemsDto } from './dto/load-items.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateActivityLogDto } from 'src/activity-log/dto/creat-activity-log.dto';

@ApiTags('Magic-mover')
@Controller('magic-mover')
export class MagicMoverController {
  constructor(private readonly magicMoverService: MagicMoverService) {}

  @ApiOperation({ summary: 'Add  magic mover' })
  @ApiResponse({ type: CreateMagicMoverDto })
  @Post('add')
  async addMagicMover(
    @Body() createMagicMoverDto: CreateMagicMoverDto,
  ): Promise<MagicMover> {
    return await this.magicMoverService.addMagicMover(createMagicMoverDto);
  }

  @ApiOperation({ summary: 'Load items to  magic mover' })
  @ApiResponse({ type: CreateMagicMoverDto })
  @Post('load')
  async loadItems(@Body() loadItemsDto: LoadItemsDto) {
    return await this.magicMoverService.loadItems(loadItemsDto);
  }

  @ApiOperation({ summary: 'Start mission for a magic mover exist ' })
  @ApiResponse({ type: CreateActivityLogDto })
  @Put('start-mission/:id')
  async startMission(@Param('id') id: string) {
    return await this.magicMoverService.startMission(id);
  }

  @ApiOperation({ summary: 'Finish mission for a magic mover exist ' })
  @ApiResponse({ type: CreateActivityLogDto })
  @Put('done/:id')
  async done(@Param('id') id: string) {
    return await this.magicMoverService.done(id);
  }

  @ApiOperation({
    summary: 'Get all  magic movers that have completed thir mission ',
  })
  @ApiResponse({ type: CreateMagicMoverDto, isArray: true })
  @ApiExtraModels(MagicMoverQueryDto)
  @Get('completed-mission')
  async findAllCompletedMission(@Query() query: MagicMoverQueryDto) {
    return await this.magicMoverService.findAllCompletedMission(query);
  }

  @ApiOperation({
    summary: 'Get all  magic movers  ',
  })
  @ApiResponse({ type: CreateMagicMoverDto, isArray: true })
  @ApiExtraModels(MagicMoverQueryDto)
  @Get()
  async findAll(@Query() query: MagicMoverQueryDto) {
    return await this.magicMoverService.findAll(query);
  }

  @ApiOperation({ summary: 'Get single magic mover  by id ' })
  @ApiResponse({ type: CreateMagicMoverDto })
  @Get(':id')
  async findOne(
    @Param('id')
    id: string,
  ) {
    return await this.magicMoverService.findOne(id);
  }
}
