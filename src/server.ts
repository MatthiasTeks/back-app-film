import express, { Application, Request, Response } from 'express';
import dotenv, { DotenvConfigOptions } from 'dotenv';
import morgan from 'morgan';

import { setupRoutes } from './routes';
import { corsMiddleware } from './middlewares/cors';
import { signUrl } from "./services/SignUrl";
import { createDBConnection } from "./config/database";

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
        </head>
        <body>
            <h1>${message}</h1>
        </body>
    </html>
  `);
});

(async () => {
    try {
        await createDBConnection();
        console.log('Database connection successfully established');

        app.listen(port, () =>  {
            console.log(`Server listening on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to establish database connection', err);
        process.exit(1);
    }
})();