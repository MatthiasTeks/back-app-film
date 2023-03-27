import { Request, Response, NextFunction } from 'express';

/**
* Middleware function to enable CORS requests and headers.
* @function
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @param {NextFunction} next - The next middleware function.
* @returns {void}
*/
export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    res.header("Access-Control-Allow-Origin", process.env.HEROKU_APP_URL || 'http://localhost:5173');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

    if (req.method === "OPTIONS") {
        return res.status(200).json({});
    }

    next();
};s 