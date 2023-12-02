import mongoose, { Schema } from 'mongoose';
import type { Model } from 'mongoose';
import type { IRequestDocument } from '../../../typings/MongoTypes';

const requestSchema = new Schema<IRequestDocument>({
  userId: { type: String, required: true },
  request: { type: [String], required: true },
  aiAnswer: { type: [String], required: true },
});

requestSchema.statics.findOneOrCreate = async function findOneOrCreate(
  this: Model<IRequestDocument>,
  filter: mongoose.FilterQuery<IRequestDocument>,
  doc: IRequestDocument,
) {
  const one = await this.findOne(filter);
  return one ?? (await this.create(doc));
};

interface RequestModel extends Model<IRequestDocument> {
  findOneOrCreate(
    filter: mongoose.FilterQuery<IRequestDocument>,
    doc: IRequestDocument,
  ): Promise<IRequestDocument>;
}

const RequestModel = mongoose.connection
  .useDb('bigbrain')
  .model<IRequestDocument, RequestModel>('requests', requestSchema);

export default RequestModel;