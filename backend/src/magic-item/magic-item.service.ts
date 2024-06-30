import { Injectable } from '@nestjs/common';
import { CreateMagicItemDto } from './dto/create-magic-item.dto';
import { MagicItem, MagicItemDocument } from './entities/magic-item.schema';
import { InjectModel } from '@nestjs/mongoose';

import { MagicItemQueryDto } from './dto/query.dto';
import { parseObjectId } from 'src/helper/ParseObjectIdPipe ';
import { Model } from 'mongoose';

@Injectable()
export class MagicItemService {
  constructor(
    @InjectModel(MagicItem.name)
    private readonly magicItemModel: Model<MagicItemDocument>,
  ) {}
  async addMagicItem(createMagicItemDto: CreateMagicItemDto) {
    return await this.magicItemModel.create(createMagicItemDto);
  }

  async findAll(query: MagicItemQueryDto) {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.magicItemModel.countDocuments().exec();
    const data = await this.magicItemModel
      .find()
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

  async findAllByIds(itemsIds: string[]) {
    return await this.magicItemModel.find({ _id: { $in: itemsIds } });
  }
  async calculatingWeights(itemsIds: string[]) {
    const items = await this.findAllByIds(itemsIds);
    const weight = items.reduce((sum, item) => sum + item.weight, 0);
    return weight;
  }

  async findOne(id: string) {
    const magivItemId = parseObjectId(id);
    return await this.magicItemModel.findById({ _id: magivItemId });
  }
}
