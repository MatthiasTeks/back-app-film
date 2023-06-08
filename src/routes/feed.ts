import express, { Request, Response } from 'express';
import multer from "multer";

import { getAllFeed, updateFeedById } from "../models/feed";
import { sendResponse } from "../services/SendResponse";
import { signUrl } from "../services/SignUrl";

const feedRouter = express.Router();

// Multer storage configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Get all feed from home page
 */
feedRouter.get('/', async (req: Request, res: Response) => {
    try {
        const feeds = await getAllFeed();
        if(feeds){
            const signedFeeds = await Promise.all(feeds.map(async (feed) => {
                const signedUrl = await signUrl(feed.s3_image_key);
                return { ...feed, signedUrl };
            }));
            sendResponse(res, signedFeeds, 'feed not found');
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving feed from database', error: err });
    }
});

/**
 * Update feed in home page based on id
 */
feedRouter.post('/update', upload.single('file'), async (req: Request, res: Response) => {
    try {
        const feedId = req.body.news;
        const file = req.file;
        if(file){
            const feed = await updateFeedById(feedId, file);
            sendResponse(res, feed, 'feed not updated');
        } else {
            res.status(404).json({ message: 'File not found'});
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating feed from database', error: err });
    }
});

export default feedRouter;