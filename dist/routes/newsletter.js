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
const newsletter_1 = __importDefault(require("../models/newsletter"));
const newsletterRouter = express_1.default.Router();
/**
* Retrieve all newsletters.
* @async
* @function
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
newsletterRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsletter = yield newsletter_1.default.findMany();
        if (newsletter) {
            res.status(200).json(newsletter);
        }
        else {
            res.status(404).json({ message: 'newsletter not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving newsletter from database', error: err });
    }
}));
/**
* Retrieve specific newsletter by mail address.
* @async
* @function
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
newsletterRouter.get('/:mail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mail = req.query.mail;
        const newsletter = yield newsletter_1.default.findOne(mail);
        if (newsletter) {
            res.status(200).json(newsletter);
        }
        else {
            res.status(404).json({ message: 'newsletter not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving newsletter from database', error: err });
    }
}));
/**
* Create a new newsletter
* @async
* @function
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
newsletterRouter.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = newsletter_1.default.validate(req.body);
        if (error) {
            res.status(422).json({ validation: error.details });
        }
        else {
            const lowercaseMail = req.body.actor_name.mail.toLowerCase();
            const mailExist = yield newsletter_1.default.findOne(lowercaseMail);
            if (mailExist) {
                res.status(409).json({ message: "Newsletter with the same mail already exists" });
            }
            else {
                const createdNewsletter = yield newsletter_1.default.create(req.body);
                res.status(201).json(createdNewsletter);
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error saving the newsletter', error: err });
    }
}));
exports.default = newsletterRouter;
