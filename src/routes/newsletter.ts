import express, { Request, Response } from 'express';

import {
    createNewsletter,
    deleteNewsletterByMail,
    getAllNewsletter,
    getNewsletterByMail,
    validateNewsletter
} from "../models/newsletter";

const newsletterRouter = express.Router();

/**
* Retrieve all newsletters.
* @param {Request} req
* @param {Response} res
* @returns {Promise<void>}
* @throws {Error}
*/
newsletterRouter.get('/', async (req: Request, res: Response) => {
    try {
        const newsletter = await getAllNewsletter();
        newsletter ? res.status(200).json(newsletter) : res.status(404).json({ message: 'newsletter not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving newsletter from database', error: err });
    }
});

/**
* Retrieve specific newsletter by mail address.
* @param {Request} req
* @param {Response} res
* @returns {Promise<void>}
* @throws {Error}
*/
newsletterRouter.get('/:mail', async (req: Request, res: Response) => {
    try {
        const mail = req.query.mail;
        const newsletter = await getNewsletterByMail(mail as string);
        newsletter ? res.status(200).json(newsletter) : res.status(404).json({ message: 'newsletter not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving newsletter from database', error: err });
    }
});

/**
* Create a new newsletter
* @param {Request} req
* @param {Response} res
* @returns {Promise<void>}
* @throws {Error}
*/
newsletterRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const error = validateNewsletter(req.body);
        if (error) {
            res.status(422).json({ validation: error.details });
        } else {
            const lowercaseMail = req.body.actor_name.mail.toLowerCase();
            const mailExist = await getNewsletterByMail(lowercaseMail);
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
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
newsletterRouter.delete('/delete/:mail', async (req: Request, res: Response): Promise<void> => {
    try {
        const mail = req.params.mail as string;
        const newsletter = await getNewsletterByMail(mail);
        if (!newsletter) {
            res.status(404).json({ message: 'Newsletter not found' });
        } else {
            const result = await deleteNewsletterByMail(mail);
            result ? res.status(204).json(result) : res.status(500).json({ message: 'newsletter not deleted' });
        }
    } catch (error) {
        console.error('An error occurred while deleting the newsletter ', error);
        res.status(500).json({ message: 'An error occurred while deleting the newsletters' });
    }
});

export default newsletterRouter;
