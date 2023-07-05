import express, { Request, Response } from 'express';
import { sendResponse } from "../services/SendResponse";
import { getBackground, updateBackground } from "../models/background";
import { signUrl } from "../services/SignUrl";
import { fileUpload } from '../middleware/multerMiddleware';

const backgroundRouter = express.Router();

/**
* Retrieve background video from home page.
*/
backgroundRouter.get('/', async (req: Request, res: Response) => {
    try {
        const background = await getBackground();
        if(background){
            const signedUrl = await signUrl(background[0].s3_video_key)
            sendResponse(res, signedUrl, 'background not found');
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving background from database', error: err });
    }
});

/**
 * Update background video from home page
 */
backgroundRouter.post('/update', fileUpload.single('file'), async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if(file){
            const background = await updateBackground(file);
            sendResponse(res, background, 'background not updated');
        } else {
            res.status(404).json({ message: 'Type file is not supported'});
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating background from database', error: err });
    }
});

export default backgroundRouter