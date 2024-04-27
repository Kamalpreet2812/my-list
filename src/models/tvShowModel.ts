import mongoose, { Schema, Document } from 'mongoose';

interface TVShow {
  title: string;
  description: string;
  genres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'], required: true }];
  episodes: Array<{ episodeNumber: number; seasonNumber: number; releaseDate: Date; director: string; actors: string[] }>;
}

const TVShowSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'], required: true }],
  episodes: [{
    episodeNumber: { type: Number, required: true },
    seasonNumber: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    actors: [{ type: String, required: true }],
  }],
});

const TVShowModel = mongoose.model<TVShow & Document>('TVShow', TVShowSchema);

export default TVShowModel;
