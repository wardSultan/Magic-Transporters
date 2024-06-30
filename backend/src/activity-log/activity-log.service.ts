import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { ActivityLog } from './entities/activity-log.schema';
import { Model } from 'mongoose';
import { ActivityLogQueryDto } from './dto/query.dto';
import { parseObjectId } from 'src/helper/ParseObjectIdPipe ';
import { CreateActivityLogDto } from './dto/creat-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLog>,
  ) {}

  async logActivity(createActivityLogDto: CreateActivityLogDto) {
    return await this.activityLogModel.create(createActivityLogDto);
  }

  async findAll(query: ActivityLogQueryDto) {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.activityLogModel.countDocuments().exec();
    const data = await this.activityLogModel
      .find()
      .populate('magicMover')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();
    return {
      data: data,
      total: total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    const activityId = parseObjectId(id);
    return await this.activityLogModel.findById({ _id: activityId });
  }
}
