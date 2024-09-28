// src/models/Strategy.ts
import mongoose from 'mongoose';

const StrategySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  tags: [String],
}, {
  timestamps: true
});

export default mongoose.models.Strategy || mongoose.model('Strategy', StrategySchema);