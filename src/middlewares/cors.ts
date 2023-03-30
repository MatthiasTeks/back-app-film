import { Request, Response, NextFunction } from 'express';

/**
* Middleware function to enable CORS requests and headers.
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @param {NextFunction} next - The next middleware function.
*/
export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    res.header("Access-Control-Allow-Origin", process.env.HEROKU_APP_URL || 'http://localhost:3000');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

    if (req.method === "OPTIONS") {
        res.status(200).json({});
        next();
    } else {
        next();
    }
};