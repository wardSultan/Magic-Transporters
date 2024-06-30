import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { MagicItem } from 'src/magic-item/entities/magic-item.schema';

export type MagicMoverDocument = MagicMover & Document;

export enum QuestState {
  RESTING = 'resting',
  LOADING = 'loading',
  ON_MISSION = 'on_mission',
  DONE = 'done',
}

@Schema({ timestamps: true })
export class MagicMover {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  weightLimit: number;

  @Prop({ required: true })
  energy: number;

  @Prop({
    required: true,
    enum: QuestState,
    default: 'resting',
  })
  questState: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MagicItem' }] })
  items: MagicItem[];

  @Prop({ default: 0 })
  missionsCompleted: number;
}

export const MagicMoverSchema = SchemaFactory.createForClass(MagicMover);
