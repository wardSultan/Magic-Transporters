import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogQueryDto } from './dto/query.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateActivityLogDto } from './dto/creat-activity-log.dto';

@ApiTags('Activity-log')
@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @ApiOperation({ summary: 'Add  Activity-log ' })
  @ApiResponse({ type: CreateActivityLogDto })
  @Post('add')
  async logActivity(@Body() createActivityLogDto: CreateActivityLogDto) {
    return await this.activityLogService.logActivity(createActivityLogDto);
  }

  @ApiOperation({
    summary: 'Get all  Activity-logs  .. ',
  })
  @ApiResponse({ type: CreateActivityLogDto, isArray: true })
  @ApiExtraModels(ActivityLogQueryDto)
  @Get()
  async findAll(@Query() query: ActivityLogQueryDto) {
    return await this.activityLogService.findAll(query);
  }

  @ApiOperation({ summary: 'Get single Activity-log  by id ' })
  @ApiResponse({ type: CreateActivityLogDto })
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.activityLogService.findOne(id);
  }
}
