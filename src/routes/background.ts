import express, { Request, Response } from 'express';
import multer from "multer";

import { sendResponse } from "../services/SendResponse";
import { getBackground, updateBackground } from "../models/background";

const backgroundRouter = express.Router();

// Multer storage configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage })

/**
* Retrieve background video from home page.
* @param {Request} req
* @param {Response} res
* @returns {Promise<void>}
* @throws {Error}
*/
backgroundRouter.get('/', async (req: Request, res: Response) => {
    try {
        const background = await getBackground();
        sendResponse(res, background, 'background not found');
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving background from database', error: err });
    }
});

/**
 * Update background video from home page
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
backgroundRouter.post('/update', upload.single('file'), async (req: Request, res: Response) => {
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