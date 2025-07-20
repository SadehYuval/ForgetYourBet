import mongoose from 'mongoose';

const betSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['personal', 'group'],
    required: true,
  },
  placedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: function(this: any) {
      return this.type === 'group';
    }
  },

  participants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: function(this: any) {
      return this.type === 'group';
    }
  },

  description: { type: String, required: true },
  amount: { type: Number, required: true },
  deadline: { type: Date, required: true },

  status: {
    type: String,
    enum: ['active', 'closed', 'cancelled'],
    default: 'active',
  },

  winners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  authorized: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  payouts: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amountOwed: { type: Number, required: true }
  }],
}, { timestamps: true });

export const Bet = mongoose.model('Bet', betSchema);
