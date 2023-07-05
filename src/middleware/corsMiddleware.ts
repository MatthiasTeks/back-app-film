import { Request, Response, NextFunction } from 'express';

/**
* Middleware function to enable CORS requests and headers.
*/
export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

    if (req.method === "OPTIONS") {
        res.status(200).json({});
        next();
    } else {
        next();
    }
};