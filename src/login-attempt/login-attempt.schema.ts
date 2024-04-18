import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../user/user.schema';

export type LoginAttemptDocument = LoginAttempt & Document;

@Schema()
export class LoginAttempt {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string | User;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);
