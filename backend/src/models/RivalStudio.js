import mongoose from 'mongoose';

const RivalStudioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  budget: { type: Number, default: 5000000 },
  reputation: { type: Number, default: 50 },
  marketShare: { type: Number, default: 0.15 },
  producedMovies: [
    {
      title: String,
      genre: String,
      budget: Number,
      boxOffice: Number,
      releasedAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model('RivalStudio', RivalStudioSchema);