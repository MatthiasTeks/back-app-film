import express, { Request, Response } from 'express';

import {
    createNewsletter,
    destroyNewsletter,
    findAllNewsletter,
    findNewsletterByMail,
    validateNewsletter
} from "../models/newsletter";

const newsletterRouter = express.Router();

/**
* Retrieve all newsletters.
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of newsletter records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the newsletter records.
*/
newsletterRouter.get('/', async (req: Request, res: Response) => {
    try {
        const newsletter = await findAllNewsletter();
        newsletter ? res.status(200).json(newsletter) : res.status(404).json({ message: 'newsletter not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving newsletter from database', error: err });
    }
});

/**
* Retrieve specific newsletter by mail address.
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of newsletter records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the newsletter records.
*/
newsletterRouter.get('/:mail', async (req: Request, res: Response) => {
    try {
        const mail = req.query.mail;
        const newsletter = await findNewsletterByMail(mail as string);
        newsletter ? res.status(200).json(newsletter) : res.status(404).json({ message: 'newsletter not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving newsletter from database', error: err });
    }
});

/**
* Create a new newsletter
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with new newsletter records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue creating the newsletter records.
*/
newsletterRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const error = validateNewsletter(req.body);
        if (error) {
            res.status(422).json({ validation: error.details });
        } else {
            const lowercaseMail = req.body.actor_name.mail.toLowerCase();
            const mailExist = await findNewsletterByMail(lowercaseMail);
            if (mailExist) {
                res.status(409).json({ message: "Newsletter with the same mail already exists" });
            } else {
                const createdNewsletter = await createNewsletter(req.body);
                res.status(201).json(createdNewsletter);
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error saving the newsletter', error: err });
    }
});

/**
 * Delete newsletter record by id.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves with the newsletter record or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the newsletter record.
 */
newsletterRouter.delete('/delete/:mail', async (req: Request, res: Response): Promise<void> => {
    try {
        const mail = req.params.mail as string;
        const newsletter = await findNewsletterByMail(mail);
        if (!newsletter) {
            res.status(404).json({ message: 'Newsletter not found' });
        } else {
            const result = await destroyNewsletter(mail);
            result ? res.status(204).json(result) : res.status(500).json({ message: 'newsletter not deleted' });
        }
    } catch (error) {
        console.error('An error occurred while deleting the newsletter ', error);
        res.status(500).json({ message: 'An error occurred while deleting the newsletters' });
    }
});

export default newsletterRouter;
