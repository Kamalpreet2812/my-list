import express, { Request, Response } from 'express';
import ioredis from 'ioredis';
import UserListModel from '../models/userListModel';
import UserModel from '../models/userModel';
import { ItemType } from '../models/commonTypes';
import MovieModel from '../models/movieModel';
import TVShowModel from '../models/tvShowModel';

const redisClient = new ioredis({
  host:"localhost",
  port: 6379,
});

const router = express.Router();

/**
 * @swagger
 * /my-list/{type}:
 *   get:
 *     summary: Fetch records by type
 *     description: Retrieve all records of a specified type (e.g., user, movie, tv show).
 *     parameters:
 *       - in: path
 *         name: type
 *         description: The type of record to fetch (user, movie, tv-show).
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Records retrieved successfully.
 *       '400':
 *         description: Invalid type provided.
 *       '500':
 *         description: Internal server error.
 */
router.get('/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    // Validate the type
    if (!['user', 'movie', 'tv-show'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type provided' });
    }

    let records;

    // Fetch records based on the type
    switch (type) {
      case 'user':
        records = await UserModel.find();
        break;
      case 'movie':
        records = await MovieModel.find();
        break;
      case 'tv-show':
        records = await TVShowModel.find();
        break;
      default:
        break;
    }

    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records by type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /my-list/add:
 *   post:
 *     summary: Add item to user's list
 *     description: Add a movie or TV show to the user's list.
 *     parameters:
 *       - in: body
 *         name: item
 *         description: The item to add to the user's list.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               description: The ID of the user.
 *             contentId:
 *               type: string
 *               description: The ID of the content (movie/TV show).
 *             type:
 *               type: string
 *               enum: [movie, tvShow]
 *               description: The type of content (movie or TV show).
 *     responses:
 *       '200':
 *         description: Item added to the user's list successfully.
 *       '400':
 *         description: Invalid request body or item already exists in the user's list.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error.
 */
router.post('/add', async (req: Request, res: Response) => {
  try {
    const { userId, contentId, type }: { userId: string; contentId: string; type: ItemType } = req.body;

    // Check if the user exists
    const userExists = await UserModel.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the item already exists in the user's list
    const existingItem = await UserListModel.findOne({ userId, 'items.contentId': contentId });
    if (existingItem) {
      return res.status(400).json({ message: 'Item already exists in the user\'s list' });
    }

    // Add the item to the user's list
    await UserListModel.findOneAndUpdate(
      { userId },
      { $push: { items: { contentId, type } } },
      { upsert: true }
    );

    res.status(200).json({ message: 'Item added to the user\'s list successfully' });
  } catch (error) {
    console.error('Error adding item to the user\'s list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /my-list/remove:
 *   post:
 *     summary: Remove item from user's list
 *     description: Remove an item from the user's list using the item's unique ID.
 *     parameters:
 *       - in: body
 *         name: item
 *         description: The item to remove from the user's list.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               description: The ID of the user.
 *             contentId:
 *               type: string
 *               description: The ID of the content (movie/TV show) to remove.
 *     responses:
 *       '200':
 *         description: Item removed from the user's list successfully.
 *       '404':
 *         description: User not found or item not found in the user's list.
 *       '500':
 *         description: Internal server error.
 */
router.post('/remove', async (req: Request, res: Response) => {
  try {
    const { userId, contentId }: { userId: string; contentId: string } = req.body;

    // Remove the item from the user's list
    await UserListModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { contentId } } }
    );

    res.status(200).json({ message: 'Item removed from the user\'s list successfully' });
  } catch (error) {
    console.error('Error removing item from the user\'s list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/**
 * @swagger
 * /my-list/list/{userId}:
 *   get:
 *     summary: List items in user's list with content details
 *     description: Retrieve all items in the user's list with pagination support and full content details.
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: The ID of the user.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       '200':
 *         description: List of items with content details retrieved successfully.
 *       '404':
 *         description: User list not found.
 *       '500':
 *         description: Internal server error.
 */
router.get('/list/:userId', async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip: number = (page - 1) * limit;

    // Retrieve the user's list with pagination
    const userList = await UserListModel.findOne({ userId }, { items: { $slice: [skip, limit] } });

    if (!userList) {
      return res.status(404).json({ message: 'User list not found' });
    }

    // Fetch content details for each item in the user's list
    const itemsWithDetails = await Promise.all(userList.items.map(async (item: any) => {
      const cachedDetails = await redisClient.get(item.contentId);
      if (cachedDetails) {
        item.details = JSON.parse(cachedDetails);
      } else {
        // Fetch content details from database
        const contentDetails = await fetchContentDetails(item.contentId, item.type);
        // Cache the content details in Redis with expiration (e.g., 1 hour)
        redisClient.setex(item.contentId, 3600, JSON.stringify(contentDetails));
        item.details = contentDetails;
      }
      return item;
    }));

    res.status(200).json(itemsWithDetails);
  } catch (error) {
    console.error('Error listing items with content details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

async function fetchContentDetails(contentId: string, type: ItemType) {
  try {
    if (type === 'movie') {
      // Fetch movie details from the database
      const movie = await MovieModel.findById(contentId);
      if (movie) {
        return {
          id: movie.id,
          title: movie.title,
          description: movie.description,
          genres: movie.genres,
          releaseDate: movie.releaseDate,
          director: movie.director,
          actors: movie.actors,
          type: 'movie',
        };
      }
    } else if (type === 'tv_show') {
      // Fetch TV show details from the database
      const tvShow = await TVShowModel.findById(contentId);
      if (tvShow) {
        return {
          id: tvShow.id,
          title: tvShow.title,
          description: tvShow.description,
          genres: tvShow.genres,
          episodes: tvShow.episodes,
          type: 'tv-show',
        };
      }
    }
    // If content details not found
    return null;
  } catch (error) {
    console.error('Error fetching content details:', error);
    throw error;
  }
}

export default router;
