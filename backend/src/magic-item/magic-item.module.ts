import { Module } from '@nestjs/common';
import { MagicItemService } from './magic-item.service';
import { MagicItemController } from './magic-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MagicItem, MagicItemSchema } from './entities/magic-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MagicItem.name, schema: MagicItemSchema },
    ]),
  ],
  controllers: [MagicItemController],
  providers: [MagicItemService],
  exports: [MagicItemService],
})
export class MagicItemModule {}
