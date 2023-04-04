import express, { Request, Response } from 'express';
import multer from "multer";

import {
    findMedia,
    findNews,
    findPartner,
    findProject,
    updateMedia, updateNews,
    updatePartner, updateProject
} from "../models/home";

const homeRouter = express.Router();

// Multer storage configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage })

/**
* Retrieve home media video.
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the mediaHome or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/media', async (req: Request, res: Response) => {
    try {
        const media = await findMedia();
        media ? res.status(200).json(media) : res.status(404).json({ message: 'media not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving media from database', error: err });
    }
});

/**
 * Update media in home page
 * @param {Request} req - The client request.
 * @param {Response} res - The server response.
 * @returns {Promise<void>} - A Promise that resolves with the updated mediaHome or rejects with an error.
 * @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
 */
homeRouter.post('/media/update', upload.fields([{name: 's3_video_key'}]), async (req: Request, res: Response) => {
    const { file } = req.body;
    try {
        const media = await updateMedia(file);
        media ? res.status(200).json(media) : res.status(404).json({ message: 'media not updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating mediaHome from database', error: err });
    }
});

/**
* Retrieve project from home page.
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/project', async (req: Request, res: Response) => {
    try {
        const project = await findProject();
        project ? res.status(200).json(project) : res.status(404).json({ message: 'project not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving projects_home from database', error: err });
    }
});

/**
* Update project in home page
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/project/update', async (req: Request, res: Response) => {
    const { actorList, actorHome } = req.body;
    try {
        const actor = await updateProject(actorList, actorHome);
        actor ? res.status(200).json(actor) : res.status(404).json({ message: 'actor not updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating updateActor from database', error: err });
    }
});

/**
* Get news from home page
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the news or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/news', async (req: Request, res: Response) => {
    try {
        const news = await findNews();
        news ? res.status(200).json(news) : res.status(404).json({ message: 'news not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving news_home from database', error: err });
    }
});

/**
 * Update news in home page based on id
 * @param {Request} req - The client request.
 * @param {Response} res - The server response.
 * @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
 * @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
 */
homeRouter.post('/news/update', async (req: Request, res: Response) => {
    const newsHome = req.body.news;
    try {
        const news = await updateNews(newsHome);
        news ? res.status(200).json(news) : res.status(404).json({ message: 'news not updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating updateActor from database', error: err });
    }
});

/**
* Get partner from home page
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with all partner or rejects with an error.
* @throws {Error} - Throws an error if the partners was not found or if the provided data is invalid.
*/
homeRouter.get('/partner', async (req: Request, res: Response) => {
    try {
        const partner = await findPartner();
        partner ? res.status(200).json(partner) : res.status(404).json({ message: 'partner not found' });
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
        partner ? res.status(200).json(partner) : res.status(404).json({ message: 'partner not updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating updatePartner from database', error: err });
    }
});

export default homeRouter