import type { Document } from 'mongoose';

export interface IRequestDocument extends Document {
  aiAnswer: string[];
  request: string[];
  userId: string;
}