import mongoose from 'mongoose';

const videoLectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: { type: String, required: true },
  department: String,
  year: Number,
  videoUrl: { type: String, required: true },
  thumbnailUrl: String,
  duration: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 }
}, { timestamps: true });

videoLectureSchema.index({ subject: 1 });

export default mongoose.model('VideoLecture', videoLectureSchema);
