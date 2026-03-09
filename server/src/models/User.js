import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email:{ type: String, required: true, unique: true },
  password:{ type: String, required: true },
  department:String,
  year:Number,
  role:{ type: String, enum:['user','admin'], default:'user' },
  bio: { type: String, maxlength: 300, default: '' },
  avatar: { type: String, default: '' },
  points: { type: Number, default: 0 },
  badges: [{ name: String, icon: String, earnedAt: { type: Date, default: Date.now } }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }]
}, { timestamps:true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(pass) {
  return bcrypt.compare(pass, this.password);
};

export default mongoose.model('User', userSchema);
