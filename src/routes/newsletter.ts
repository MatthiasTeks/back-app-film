import express, { Request, Response } from 'express';
import Newsletter from '../models/newsletter';

const newsletterRouter = express.Router();

/**
* Retrieve all newsletters.
* @async
* @function
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
newsletterRouter.get('/', async (req: Request, res: Response) => {
    try {
        const newsletter = await Newsletter.findMany();
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
* Retrieve specific newsletter by mail adress.
* @async
* @function
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
newsletterRouter.get('/:mail', async (req: Request, res: Response) => {
    try {
        const mail = req.query.mail;
        const newsletter = await Newsletter.findOne(mail as string);
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
* @async
* @function
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
newsletterRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const error = Newsletter.validate(req.body);
        if (error) {
            res.status(422).json({ validation: error.details });
        } else {
            const lowercaseMail = req.body.actor_name.mail.toLowerCase();
            const mailExist = await Newsletter.findOne(lowercaseMail);
            if (mailExist) {
                res.status(409).json({ message: "Newsletter with the same mail already exists" });
            } else {
                const createdNewsletter = await Newsletter.create(req.body);
                res.status(201).json(createdNewsletter);
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error saving the newsletter', error: err });
    }
});

export default newsletterRouter;
