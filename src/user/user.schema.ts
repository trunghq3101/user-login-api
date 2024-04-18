import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export enum LockDuration {
  None,
  Indefinitely,
  FiveMin,
}

export type UserDocument = User & Document;

@Schema()
export class User {
  id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  lockedUntil?: Date;

  @Prop({ default: LockDuration.None })
  lockDuration?: LockDuration;

  @Prop({ default: LockDuration.None })
  lastLockDuration: LockDuration;
}

export const UserSchema = SchemaFactory.createForClass(User);
