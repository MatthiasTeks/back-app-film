import express, { Request, Response } from 'express';

import { getAllFeed, updateFeedById } from "../models/feed";
import { sendResponse } from "../services/SendResponse";
import { signUrl } from "../services/SignUrl";

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

// feedRouter.post('/update', upload.single('file'), async (req: Request, res: Response) => {
//     try {
//         const file = req.file;
//         console.log(file);
//         if(file){
//             const background = await updateBackground(file);
//             sendResponse(res, background, 'background not updated');
//         } else {
//             res.status(404).json({ message: 'Type file is not supported'});
//         }
//     } catch (err) {
//         res.status(500).json({ message: 'Error updating background from database', error: err });
//     }
// });

export default feedRouter;