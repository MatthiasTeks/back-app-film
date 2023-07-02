import { Response } from 'express';

// Generic functions to send responses with 200 status or 404
export const sendResponse = (res: Response, data: any, errorMessage: string) => {
    data ? res.status(200).json(data) : res.status(404).json({ message: errorMessage });
};