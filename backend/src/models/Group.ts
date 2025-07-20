import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    balance: Number,
  }
],
}, { timestamps: true });

groupSchema.index({ 'members.user': 1 });

export const Group = mongoose.model('Group', groupSchema);