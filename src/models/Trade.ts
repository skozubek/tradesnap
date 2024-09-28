// src/models/Trade.ts
import mongoose from 'mongoose';

const TradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Change to false
  asset: { type: String, required: true },
  direction: { type: String, enum: ['long', 'short'], required: true },
  entryPrice: { type: Number, required: true },
  stopLoss: { type: Number, required: false },
  takeProfit: { type: Number, required: false },
  quantity: { type: Number, required: true },
  timeframe: { type: String, required: true },
  entryDate: { type: Date, required: true },
  exitPrice: { type: Number },
  exitDate: { type: Date },
  status: { type: String, enum: ['open', 'closed', 'cancelled'], default: 'open' },
  outcome: { type: String, enum: ['win', 'loss', 'breakeven'] },
  pnl: { type: Number },
  notes: { type: String },
  tags: [String],
  strategyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Strategy' },
  chartImageUrl: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPrivate: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.models.Trade || mongoose.model('Trade', TradeSchema);