import express, { Request, Response } from 'express';
import {createNewsletter, findAllNewsletter, findNewsletterByMail, validateNewsletter} from "../models/newsletter";

const newsletterRouter = express.Router();

/**
* Retrieve all newsletters.
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
newsletterRouter.get('/', async (req: Request, res: Response) => {
    try {
        const newsletter = await findAllNewsletter();
        if (newsletter) {
            res.status(200).json(newsletter);
        } else {
            res.status(404).json({ message: 'newsletter not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving newsletter from database', error: err });
    }
});

/**
* Retrieve specific newsletter by mail address.
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
newsletterRouter.get('/:mail', async (req: Request, res: Response) => {
    try {
        const mail = req.query.mail;
        const newsletter = await findNewsletterByMail(mail as string);
        if (newsletter) {
            res.status(200).json(newsletter);
        } else {
            res.status(404).json({ message: 'newsletter not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving newsletter from database', error: err });
    }
});

/**
* Create a new newsletter
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
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

export default newsletterRouter;
