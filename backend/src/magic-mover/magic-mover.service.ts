import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMagicMoverDto } from './dto/create-magic-mover.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MagicMover, MagicMoverDocument } from './entities/magic-mover.schema';
import { Model } from 'mongoose';
import { MagicMoverQueryDto } from './dto/query.dto';
import { LoadItemsDto } from './dto/load-items.dto';
import { MagicItemService } from 'src/magic-item/magic-item.service';
import { MagicItem } from 'src/magic-item/entities/magic-item.schema';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { parseObjectId } from 'src/helper/ParseObjectIdPipe ';
import { Action } from 'src/activity-log/entities/activity-log.schema';

@Injectable()
export class MagicMoverService {
  constructor(
    @InjectModel(MagicMover.name)
    private readonly magicMoverModel: Model<MagicMoverDocument>,
    @Inject(MagicItemService)
    private magicItemService: MagicItemService,
    @Inject(ActivityLogService)
    private activityLogService: ActivityLogService,
  ) {}

  async addMagicMover(
    createMagicMoverDto: CreateMagicMoverDto,
  ): Promise<MagicMover> {
    return await this.magicMoverModel.create(createMagicMoverDto);
  }

  async loadItems(loadItemsDto: LoadItemsDto) {
    const id = loadItemsDto.magicMoverId;
    const itemsIds = loadItemsDto.itemsIds;
    const magicMoverId = parseObjectId(id);

    //Check if Mover is exist ..
    const mover = await this.magicMoverModel.findById(magicMoverId);
    if (!mover)
      throw new NotFoundException(`Mover with id ${magicMoverId} not exist ! `);

    //Check if  quest state is not on mission
    if (mover.questState === 'on_mission') {
      throw new HttpException(
        'Cannot load items: the Magic Mover is already on a mission.',
        HttpStatus.BAD_REQUEST,
      );
    }

    //Check if same item already loaded in mover
    itemsIds.map((itemId) => {
      parseObjectId(itemId);
      if (mover.items.toString().includes(itemId))
        throw new ConflictException(`Item with id ${itemId} already loaded !!`);
    });

    //To calculat old items and new items weight if we want to load more than previous items ..
    const newItemsIds = itemsIds.concat(
      mover.items
        .toString()
        .split(',')
        .filter((id) => id.trim() !== ''),
    );

    //Check if item weight that loaded not bigger than mover limited
    const totalMagicItemWeight =
      await this.magicItemService.calculatingWeights(newItemsIds);

    if (totalMagicItemWeight > mover.weightLimit) {
      throw new HttpException(
        `Cannot load items: weight limit exceeded. mover weight limit = ${mover.weightLimit} && loading items weight = ${totalMagicItemWeight}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //loading items to mover
    const items = await this.magicItemService.findAllByIds(itemsIds);
    if (items.length == 0) {
      throw new HttpException(
        `Cannot load items: No items found `,
        HttpStatus.BAD_REQUEST,
      );
    }
    mover.items.push(...items);
    mover.questState = 'loading';

    // creating a log of this activitiy
    const activity = {
      magicMover: magicMoverId.toString(),
      action: Action.LOADING,
      details: items,
    };
    await this.activityLogService.logActivity(activity);
    return await mover.save();
  }

  async startMission(id: string) {
    const moverId = parseObjectId(id);
    //Check if Mover is exist ..
    const mover = await this.magicMoverModel.findById(moverId);
    if (!mover)
      throw new NotFoundException(`Mover with id ${moverId} not exist ! `);

    //check if Mover already on mission
    if (mover.questState === 'on_mission')
      throw new HttpException(
        `Mover with id ${moverId} already on mission ! `,
        HttpStatus.BAD_REQUEST,
      );

    //check if Mover quest state is loading
    if (mover.questState !== 'loading')
      throw new HttpException(
        `Cannot start mission for Mover with ID ${moverId}. Current quest state is "${mover.questState}" but should be "loading".`,
        HttpStatus.BAD_REQUEST,
      );

    // Update mover quest state to on mission
    return await this.magicMoverModel
      .findByIdAndUpdate({ _id: moverId })
      .then((mover) => {
        mover.questState = 'on_mission';
        return mover.save();
      })
      .then((mover) => {
        //  Creating a log of this activitiy
        const activity = {
          magicMover: mover._id.toString(),
          action: Action.ON_MISSION,
          details: {},
        };
        return this.activityLogService.logActivity(activity);
      });
  }
  async done(id: string) {
    const moverId = parseObjectId(id);
    //Check if Mover is exist ..
    const mover = await this.magicMoverModel.findById(moverId);
    if (!mover)
      throw new NotFoundException(`Mover with id ${moverId} not exist ! `);

    //check if Mover already done
    if (mover.questState === 'done')
      throw new NotFoundException(`Mover with id ${moverId} already done ! `);

    //check if Mover not on mission
    if (mover.questState !== 'on_mission')
      throw new NotFoundException(
        `Mover with ID ${moverId} is not on a mission, so it cannot be marked as done.`,
      );
    return await this.magicMoverModel
      .findByIdAndUpdate({ _id: moverId })
      .then((mover) => {
        mover.questState = 'done';
        mover.items = [] as MagicItem[];
        mover.missionsCompleted++;
        return mover.save();
      })
      .then((mover) => {
        //  Creating a log of this activitiy
        const activity = {
          magicMover: mover._id.toString(),
          action: Action.DONE,
          details: {},
        };
        return this.activityLogService.logActivity(activity);
      });
  }
  async findAllCompletedMission(query: MagicMoverQueryDto) {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.magicMoverModel
      .countDocuments({ missionsCompleted: { $gt: 0 } })
      .exec();
    const data = await this.magicMoverModel
      .find({ missionsCompleted: { $gt: 0 } })
      .sort({ missionsCompleted: -1 })
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

  async findAll(query: MagicMoverQueryDto) {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const total = await this.magicMoverModel.countDocuments().exec();
    const data = await this.magicMoverModel
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

  async findOne(id: string) {
    const moverId = parseObjectId(id);
    //Check if Mover is exist ..
    const mover = await this.magicMoverModel.findById(moverId);
    if (!mover)
      throw new NotFoundException(`Mover with id ${moverId} not exist ! `);
    return mover;
  }
}
