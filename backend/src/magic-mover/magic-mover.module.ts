import { Module } from '@nestjs/common';
import { MagicMoverService } from './magic-mover.service';
import { MagicMoverController } from './magic-mover.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MagicMover, MagicMoverSchema } from './entities/magic-mover.schema';
import { MagicItemModule } from '../magic-item/magic-item.module';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MagicMover.name, schema: MagicMoverSchema },
    ]),
    MagicItemModule,
    ActivityLogModule,
  ],
  controllers: [MagicMoverController],
  providers: [MagicMoverService],
})
export class MagicMoverModule {}
