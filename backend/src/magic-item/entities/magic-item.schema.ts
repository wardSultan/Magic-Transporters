// src/magic/schemas/magic-item.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MagicItemDocument = MagicItem & Document;

@Schema({ timestamps: true })
export class MagicItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  weight: number;
}

export const MagicItemSchema = SchemaFactory.createForClass(MagicItem);
