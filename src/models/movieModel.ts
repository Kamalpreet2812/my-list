import mongoose, { Schema, Document } from 'mongoose';

interface Movie {
  title: string;
  description: string;
  genres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'], required: true }];
  releaseDate: Date;
  director: string;
  actors: string[];
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'], required: true }],
  releaseDate: { type: Date, required: true },
  director: { type: String, required: true },
  actors: [{ type: String, required: true }],
});

const MovieModel = mongoose.model<Movie & Document>('Movie', MovieSchema);

export default MovieModel;
