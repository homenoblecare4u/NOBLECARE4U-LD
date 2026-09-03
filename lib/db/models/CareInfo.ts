import mongoose, { Schema, Document, Model } from 'mongoose';

export const CARE_NEEDED_OPTIONS = [
  'Elder Care',
  'Nursing',
  'Physiotherapy',
  'Not sure yet',
] as const;

export type CareNeededType = (typeof CARE_NEEDED_OPTIONS)[number];

export interface ICareInfo extends Document {
  userId: mongoose.Types.ObjectId;
  careNeeded: CareNeededType;
  additionalInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CareInfoSchema: Schema<ICareInfo> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    careNeeded: {
      type: String,
      required: true,
      enum: CARE_NEEDED_OPTIONS,
      trim: true,
    },
    additionalInfo: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

CareInfoSchema.index({ userId: 1, createdAt: -1 });

const CareInfo: Model<ICareInfo> =
  mongoose.models.CareInfo || mongoose.model<ICareInfo>('CareInfo', CareInfoSchema, 'care_info');

export default CareInfo;
