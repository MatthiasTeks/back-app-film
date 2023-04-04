"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsletter_1 = require("../models/newsletter");
const newsletterRouter = express_1.default.Router();
/**
* Retrieve all newsletters.
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of newsletter records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the newsletter records.
*/
newsletterRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsletter = yield (0, newsletter_1.findAllNewsletter)();
        newsletter ? res.status(200).json(newsletter) : res.status(404).json({ message: 'newsletter not found' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving newsletter from database', error: err });
    }
}));
/**
* Retrieve specific newsletter by mail address.
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of newsletter records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the newsletter records.
*/
newsletterRouter.get('/:mail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mail = req.query.mail;
        const newsletter = yield (0, newsletter_1.findNewsletterByMail)(mail);
        newsletter ? res.status(200).json(newsletter) : res.status(404).json({ message: 'newsletter not found' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving newsletter from database', error: err });
    }
}));
/**
* Create a new newsletter
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with new newsletter records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue creating the newsletter records.
*/
newsletterRouter.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = (0, newsletter_1.validateNewsletter)(req.body);
        if (error) {
            res.status(422).json({ validation: error.details });
        }
        else {
            const lowercaseMail = req.body.actor_name.mail.toLowerCase();
            const mailExist = yield (0, newsletter_1.findNewsletterByMail)(lowercaseMail);
            if (mailExist) {
                res.status(409).json({ message: "Newsletter with the same mail already exists" });
            }
            else {
                const createdNewsletter = yield (0, newsletter_1.createNewsletter)(req.body);
                res.status(201).json(createdNewsletter);
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error saving the newsletter', error: err });
    }
}));
/**
 * Delete newsletter record by id.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves with the newsletter record or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the newsletter record.
 */
newsletterRouter.delete('/delete/:mail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mail = req.params.mail;
        const newsletter = yield (0, newsletter_1.findNewsletterByMail)(mail);
        if (!newsletter) {
            res.status(404).json({ message: 'Newsletter not found' });
        }
        else {
            const result = yield (0, newsletter_1.destroyNewsletter)(mail);
            result ? res.status(204).json(result) : res.status(500).json({ message: 'newsletter not deleted' });
        }
    }
    catch (error) {
        console.error('An error occurred while deleting the newsletter ', error);
        res.status(500).json({ message: 'An error occurred while deleting the newsletters' });
    }
}));
exports.default = newsletterRouter;
//# sourceMappingURL=newsletter.js.map