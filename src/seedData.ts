// Import models and enums
import UserModel from './models/userModel';
import MovieModel from './models/movieModel';
import TVShowModel from './models/tvShowModel';
import UserListModel from './models/userListModel';
import { Genre } from './models/commonTypes';

// Function to seed initial data
const seedData = async () => {
  try {
    // Clear existing data
    await Promise.all([UserModel.deleteMany({}), MovieModel.deleteMany({}), TVShowModel.deleteMany({}), UserListModel.deleteMany({})]);

    // Insert users
    const users = await UserModel.insertMany([
      {
        username: 'user1',
        preferences: { favoriteGenres: [Genre.Action, Genre.Comedy], dislikedGenres: [Genre.Horror] },
        watchHistory: [],
      },
      {
        username: 'user2',
        preferences: { favoriteGenres: [Genre.Drama, Genre.Romance], dislikedGenres: [Genre.SciFi] },
        watchHistory: [],
      },
    ]);

    // Insert movies
    const movies = await MovieModel.insertMany([
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        genres: [Genre.Action, Genre.Action, Genre.SciFi],
        releaseDate: new Date('2010-07-16'),
        director: 'Christopher Nolan',
        actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
      },
      {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        genres: [Genre.Drama],
        releaseDate: new Date('1994-10-14'),
        director: 'Frank Darabont',
        actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
      },
    ]);

    // Insert TV shows
    const tvShows = await TVShowModel.insertMany([
      {
        title: 'Friends',
        description: 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.',
        genres: [Genre.Comedy, Genre.Comedy],
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, releaseDate: new Date('1994-09-22'), director: 'James Burrows', actors: ['Jennifer Aniston', 'Courteney Cox', 'Lisa Kudrow'] },
          { episodeNumber: 2, seasonNumber: 1, releaseDate: new Date('1994-09-29'), director: 'James Burrows', actors: ['Jennifer Aniston', 'Courteney Cox', 'Lisa Kudrow'] },
        ],
      },
      {
        title: 'Breaking Bad',
        description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
        genres: [Genre.Comedy, Genre.Drama, Genre.Comedy],
        episodes: [
          { episodeNumber: 1, seasonNumber: 1, releaseDate: new Date('2008-01-20'), director: 'Vince Gilligan', actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'] },
          { episodeNumber: 2, seasonNumber: 1, releaseDate: new Date('2008-01-27'), director: 'Vince Gilligan', actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'] },
        ],
      },
    ]);

    // Insert user lists
    await UserListModel.insertMany([
      { userId: users[0]._id, items: [{ contentId: movies[0]._id.toString(), type: 'movie' }, { contentId: tvShows[0]._id.toString(), type: 'tv_show' }] },
      { userId: users[1]._id, items: [{ contentId: movies[1]._id.toString(), type: 'movie' }, { contentId: tvShows[1]._id.toString(), type: 'tv_show' }] },
    ]);

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default seedData;
