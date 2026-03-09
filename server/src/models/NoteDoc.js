import mongoose from 'mongoose';

const noteDocSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subject: String,
  isPublic: { type: Boolean, default: false }
}, { timestamps: true });

noteDocSchema.index({ owner: 1 });

export default mongoose.model('NoteDoc', noteDocSchema);
