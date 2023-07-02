import express, { Application, Request, Response } from 'express';
import dotenv, { DotenvConfigOptions } from 'dotenv';
import morgan from 'morgan';
import { setupRoutes } from './routes';
import { corsMiddleware } from './middleware/cors';
import { createDBConnection } from "./config/database";

dotenv.config(<DotenvConfigOptions>{ silent: true });

const port: number | string = process.env.PORT || 4242;

const createApp = async (): Promise<Application> => {
    const app: Application = express();

    app.use(corsMiddleware);
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    setupRoutes(app);

    app.get('/', (req: Request, res: Response) => {
        const message = 'API Films de la Bande';
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome</title>
            </head>
            <body>
                <h1>${message}</h1>
            </body>
        </html>
      `);
    });

    return app;
}

const startServer = async () => {
    try {
        await createDBConnection();
        console.log('Database connection successfully established');

        const app = await createApp();
        app.listen(port, () =>  {
            console.log(`Server listening on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to establish database connection', err);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

export { createApp };