import express, { Request, Response } from 'express';

import { getAllFeed, updateFeedById } from "../models/feed";
import { sendResponse } from "../services/SendResponse";

const feedRouter = express.Router();

/**
 * Get all feed from home page
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
feedRouter.get('/', async (req: Request, res: Response) => {
    try {
        const news = await getAllFeed();
        sendResponse(res, news, 'feed not found');
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving feed from database', error: err });
    }
});

/**
 * Update feed in home page based on id
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}.
 * @throws {Error}
 */
feedRouter.post('/update', async (req: Request, res: Response) => {
    const feedId = req.body.news;
    try {
        const feed = await updateFeedById(feedId);
        sendResponse(res, feed, 'feed not updated');
    } catch (err) {
        res.status(500).json({ message: 'Error updating feed from database', error: err });
    }
});

export default feedRouter;