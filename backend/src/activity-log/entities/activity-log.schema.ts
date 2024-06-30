// activity-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { MagicMover } from 'src/magic-mover/entities/magic-mover.schema';

export enum Action {
  LOADING = 'loading',
  ON_MISSION = 'on_mission',
  DONE = 'done',
}

@Schema({ timestamps: true })
export class ActivityLog extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MagicMover',
    required: true,
  })
  magicMover: MagicMover;

  @Prop({
    required: true,
    enum: Action,
  })
  action: string;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
