import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app'; // Assuming your Express app instance is exported as 'app'
import UserListModel from '../src/models/userListModel';
import UserModel from '../src/models/userModel';

chai.use(chaiHttp);
const expect = chai.expect;

describe('My List API', () => {
  // Define test data
  const testUser = {
    _id: 'user123',
    username: 'testuser',
    preferences: {
      favoriteGenres: ['Action', 'Comedy'],
      dislikedGenres: ['Horror'],
    },
    watchHistory: [],
  };

  const testMovie = {
    _id: 'movie123',
    title: 'Test Movie',
    description: 'This is a test movie',
    genres: ['Action', 'Comedy'],
    releaseDate: new Date(),
    director: 'Test Director',
    actors: ['Actor 1', 'Actor 2'],
  };

  const testTVShow = {
    _id: 'tvshow123',
    title: 'Test TV Show',
    description: 'This is a test TV show',
    genres: ['Action', 'Comedy'],
    episodes: [
      {
        episodeNumber: 1,
        seasonNumber: 1,
        releaseDate: new Date(),
        director: 'Test Director',
        actors: ['Actor 1', 'Actor 2'],
      }
    ],
  };

  // Set up before running tests
  before(async () => {
    // Create a test user
    await UserModel.create(testUser);
  });

  // Clean up after running tests
  after(async () => {
    // Delete the test user and related data
    await UserModel.deleteOne({ _id: testUser._id });
    await UserListModel.deleteMany({ userId: testUser._id });
  });

  describe('POST /my-list/add', () => {
    it('should add a movie to the user\'s list', async () => {
      const res = await chai.request(app)
        .post('/my-list/add')
        .send({ userId: testUser._id, contentId: testMovie._id, type: 'movie' });

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Item added to the user\'s list successfully');
    });

    it('should add a TV show to the user\'s list', async () => {
      const res = await chai.request(app)
        .post('/my-list/add')
        .send({ userId: testUser._id, contentId: testTVShow._id, type: 'tv_show' });

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Item added to the user\'s list successfully');
    });
  });

  describe('POST /my-list/remove', () => {
    it('should remove an item from the user\'s list', async () => {
      const res = await chai.request(app)
        .post('/my-list/remove')
        .send({ userId: testUser._id, contentId: testMovie._id });

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Item removed from the user\'s list successfully');
    });
  });

  describe('GET /my-list/list/:userId', () => {
    it('should retrieve the user\'s list', async () => {
      const res = await chai.request(app)
        .get(`/my-list/list/${testUser._id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });
  });
});
