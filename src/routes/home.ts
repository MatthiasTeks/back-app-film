import express, { Request, Response } from 'express';

import {findActor, findMedia, findNews, findPartner, updateActor, updatePartner} from "../models/home";

const homeRouter = express.Router();

/**
* Retrieve home media video.
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/media', async (req: Request, res: Response) => {
    try {
        const media = await findMedia();
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
* Retrieve actor from home page.
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/actor', async (req: Request, res: Response) => {
    try {
        const actors = await findActor();
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
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/actor/update', async (req: Request, res: Response) => {
    const { actorList, actorHome } = req.body;
    try {
        const actor = await updateActor(actorList, actorHome);
        res.status(200).json(actor);
    } catch (err) {
        res.status(500).json({ message: 'Error updating updateActor from database', error: err });
    }
});

/**
* Get news from home page
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/news', async (req: Request, res: Response) => {
    try {
        const news = await findNews();
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
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/partner', async (req: Request, res: Response) => {
    try {
        const partner = await findPartner();
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
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/partner/update', async (req: Request, res: Response) => {
    const { name, media, idPartner } = req.body;
    try {
        const partner = await updatePartner(name, media, idPartner);
        res.status(200).json(partner);
    } catch (err) {
        res.status(500).json({ message: 'Error updating updatePartner from database', error: err });
    }
});

export default homeRouter