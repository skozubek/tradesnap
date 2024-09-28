// src/models/Comment.ts
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade', required: true },
  content: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);