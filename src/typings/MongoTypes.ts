import type { Document } from 'mongoose';

export interface IRequestDocument extends Document {
    request: string[];
    ipAddress: string;
}
