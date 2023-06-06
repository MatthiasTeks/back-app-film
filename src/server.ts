import express, { Application, Request, Response } from 'express';

import morgan from 'morgan';

import { setupRoutes } from './routes';
import { corsMiddleware } from './middlewares/cors';

import dotenv, { DotenvConfigOptions } from 'dotenv';
import {signUrl} from "./services/SignUrl";
import {createDBConnection} from "./config/database";
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

/**
 * Get a signed URL for a file s3 bucket
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
app.get('/sign-url/:key', async (req: Request, res: Response): Promise<void> => {
    try {
        const key = req.params.key as string;

        try {
            const response = await signUrl(key);
            if(response){
                res.status(200).json({ response });
            } else {
                res.status(404).json({message: 'something happened' });
            }
        } catch (err) {
            res.status(404).json({ message: 'Error retrieving this file name on our bucket', error: err });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving file from bucket', error: err });
    }
});

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