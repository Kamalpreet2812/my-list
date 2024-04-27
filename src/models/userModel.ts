import mongoose, { Schema, Document } from 'mongoose';

interface User {
  username: string;
  preferences: {
    favoriteGenres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'], required: true }];
    dislikedGenres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'], required: true }];
  };
  watchHistory: Array<{ contentId: string; watchedOn: Date; rating?: number }>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  preferences: {
    favoriteGenres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'] }],
    dislikedGenres: [{ type: String, enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'] }],
  },
  watchHistory: [{ contentId: { type: String, required: true }, watchedOn: { type: Date, required: true }, rating: { type: Number } }],
});

const UserModel = mongoose.model<User & Document>('User', UserSchema);

export default UserModel;
