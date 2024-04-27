import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'
import bodyParser from 'body-parser';
import myListRoutes from './routes/myListRoutes';
import cors from 'cors';

const app = express();
// Enable CORS middleware to allow all origins
app.use(cors({
  origin: '*'
}));

// Swagger options
const options = {
  definition: {
    info: {
      title: 'My List API',
      version: '1.0.0',
      description: 'API documentation for My List feature',
    },
  },
  // Paths to files containing Swagger annotations
  apis: ['./routes/myListRoutes.js'],
};

// Initialize Swagger-jsdoc
const specs = swaggerJsdoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/my-list', myListRoutes);

export default app;
