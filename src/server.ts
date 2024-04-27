// server.ts

import mongoose from 'mongoose';
import seedData from './seedData';
import app from './app';
// Load environment variables
require('dotenv').config();

console.log(JSON.stringify(process.env.MONGODB_URI));
// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is not provided in environment variables.');
    }

    await mongoose.connect(MONGODB_URI);

    console.log('Connected to MongoDB');

    // Seed data if it's the first time starting the server
    // const usersCount = await UserModel.countDocuments();
    await seedData();

    // Start the server
    const PORT: number = parseInt(process.env.PORT || '3000', 10);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} Open http://localhost:3000/api-docs/`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Initialize server
const startServer = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

startServer();
