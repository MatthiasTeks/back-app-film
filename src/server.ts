import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import chalk from 'chalk';

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
app.get('/', (req: Request, res: Response) => {
    const message = 'API Films de la Bande';
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenue</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #e1e1e1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                }
                h1 {
                    font-size: 3rem;
                    color: #ffffff;
                    background-color: #000000;
                    padding: 20px;
                    border-radius: 10px;
                }
            </style>
        </head>
        <body>
            <h1>${message}</h1>
        </body>
    </html>
  `);
});

app.listen(port, () =>  {
  console.log(`Server listening on http://localhost:${port}`);
});