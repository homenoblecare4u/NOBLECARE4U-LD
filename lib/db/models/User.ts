import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  city: string;
  countryCode: string;
  timezone: string;
  status: 'ACTIVE' | 'DELETED' | 'ONHOLD';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, sparse: true, trim: true, lowercase: true },
    city: { type: String, required: true, trim: true },
    countryCode: { type: String, default: '+91', trim: true },
    timezone: { type: String, default: 'Asia/Kolkata', trim: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'DELETED', 'ONHOLD'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ createdAt: -1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema, 'users');

export default User;
