import express, { Application } from 'express';
import morgan from 'morgan';
import { corsMiddleware } from './middlewares';
import { setupRoutes } from './routes';

// Create Express app instance
const app: Application = express();

// Middlewares
app.use(corsMiddleware);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

// Configure routes
setupRoutes(app);

export default app;