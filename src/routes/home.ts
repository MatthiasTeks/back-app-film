import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Home from '../models/home';

const homeRouter = express.Router();

homeRouter.use('/assets', express.static(path.join(__dirname, '/assets')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fileExist = fs.existsSync(path.join('assets/home', file.originalname));
        if (fileExist) {
            let error = new Error('File already exists');
            return cb(error, '');
        } else {
            cb(null, 'assets/home');
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

/**
* Retrieve home media video.
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/media', async (req: Request, res: Response) => {
    try {
        const media = await Home.findMedia();
        if (media) {
            res.status(200).json(media);
        } else {
            res.status(404).json({ message: 'media not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving media from database', error: err });
    }
});

/**
* Update home media video.
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/media/update', upload.single('file'), async (req: Request, res: Response) => {
    let file = req.file;
    try {
        const media = await Home.updateMedia(file.filename);
        if (media) {
            res.status(200).json(media);
        } else {
            res.status(404).json({ message: 'media not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating media from database', error: err });
    }
});

/**
* Retrieve actor from home page.
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/actor', async (req: Request, res: Response) => {
    try {
        const actors = await Home.findActor();
        if (actors) {
            res.status(200).json(actors);
        } else {
            res.status(404).json({ message: 'actors_home not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving actors_home from database', error: err });
    }
});

/**
* Update actor in home page
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/actor/update', async (req: Request, res: Response) => {
    const { actorList, actorHome } = req.body;
    try {
        const updateActor = await Home.updateActor(actorList, actorHome);
        if (updateActor) {
            res.status(200).json(updateActor);
        } else {
            res.status(404).json({ message: 'updateActor not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating updateActor from database', error: err });
    }
});

/**
* Get news from home page
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/news', async (req: Request, res: Response) => {
    try {
        const news = await Home.findNews();
        if (news) {
            res.status(200).json(news);
        } else {
            res.status(404).json({ message: 'news_home not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving news_home from database', error: err });
    }
});

/**
* Get partner from home page
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/partner', async (req: Request, res: Response) => {
    try {
        const partner = await Home.findPartner();
        if (partner) {
            res.status(200).json(partner);
        } else {
            res.status(404).json({ message: 'partner_home not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving partner_home from database', error: err });
    }
});

/**
* Update partner from home page
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/partner/update', async (req: Request, res: Response) => {
    const { name, media, idPartner } = req.body;
    try {
        const updatePartner = await Home.updatePartner(name, media, idPartner);
        if (updatePartner) {
            res.status(200).json(updatePartner);
        } else {
            res.status(404).json({ message: 'updatePartner not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating updatePartner from database', error: err });
    }
});

module.exports = homeRouter	