import { Response } from 'express';

export const sendResponse = (res: Response, data: any, errorMessage: string) => {
    data ? res.status(200).json(data) : res.status(404).json({ message: errorMessage });
};