import express, { Application, Request, Response } from 'express';
import { PoolConnection } from 'mysql2/promise';
import morgan from 'morgan';

import { setupRoutes } from './routes';
import { createDBConnection } from "./config/database";
import { corsMiddleware } from './middlewares/cors';

import dotenv, { DotenvConfigOptions } from 'dotenv';
dotenv.config(<DotenvConfigOptions>{ silent: true });

// SETUP
const app: Application = express();
const port: number | string = process.env.PORT || 4242;

// MIDDLEWARES
app.use(corsMiddleware);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTING
setupRoutes(app);

// TEST CONNECTION
app.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await createDBConnection();
    const [rows] = await connection.query('SELECT * FROM projet');
    res.json(rows);
    connection.release();
  } catch (err) {
      console.error('Erreur lors de la requête :', err);
      res.status(500).send('Erreur lors de la requête');
  }
});

app.listen(port, () =>  {
  console.log(`Server listening on http://localhost:${port}`);
});