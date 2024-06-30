import { BadRequestException } from '@nestjs/common';
import * as mongoose from 'mongoose';

export function parseObjectId(value: string): mongoose.Types.ObjectId {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new BadRequestException(`${value} Is Invalid ObjectId`);
  }

  return new mongoose.Types.ObjectId(value);
}
