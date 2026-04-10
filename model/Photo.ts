import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  imgbbId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  displayUrl: { type: String, required: true },
  deleteUrl: { type: String },
  title: { type: String, required: true },
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);