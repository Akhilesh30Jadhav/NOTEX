import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  room: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, maxlength: 2000 },
  type: { type: String, enum: ['text', 'system'], default: 'text' }
}, { timestamps: true });

chatMessageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
