import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subject: String,
  description: String,
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  color: { type: String, default: '#818cf8' },
  recurring: { type: Boolean, default: true }
}, { timestamps: true });

studyPlanSchema.index({ user: 1, day: 1 });

export default mongoose.model('StudyPlan', studyPlanSchema);
