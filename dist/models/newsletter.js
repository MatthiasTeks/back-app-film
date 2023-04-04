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
exports.destroyNewsletter = exports.createNewsletter = exports.findNewsletterByMail = exports.findAllNewsletter = exports.validateNewsletter = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = require("../config/database");
/**
* Validates a newsletter object based on the provided data.
* @param {Newsletter} data - The newsletter object to be validated.
* @param {boolean} [forCreation=true] - A flag to indicate whether the validation is for creation (required fields) or not (optional fields).
* @returns {ValidationError | undefined} - Returns a ValidationError if the data is invalid, otherwise returns undefined.
*/
const validateNewsletter = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return joi_1.default.object({
        id_newsletter: joi_1.default.number(),
        mail: joi_1.default.string().max(255).presence(presence),
        consent: joi_1.default.number().max(10).presence(presence),
    }).validate(data, { abortEarly: false }).error;
};
exports.validateNewsletter = validateNewsletter;
/**
* Retrieves all newsletter entries from the database.
* @returns {Promise<Array<Newsletter>>} - A Promise that resolves with an array of newsletter entries or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the newsletter entries from the database.
*/
const findAllNewsletter = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query('SELECT * FROM newsletter');
        connection.release();
        return result.map(row => ({
            mail: row.mail,
            consent: row.consent
        }));
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findAllNewsletter = findAllNewsletter;
/**
* Retrieves a newsletter entry by its email address.
* @param {string} mail - The email address of the newsletter entry to retrieve.
* @returns {Promise<Newsletter | undefined>} - A Promise that resolves with the newsletter entry if found or undefined if not found, or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the newsletter entry from the database.
*/
const findNewsletterByMail = (mail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query('SELECT * FROM newsletter WHERE mail = ?', [mail]);
        connection.release();
        if (result.length === 0) {
            return undefined;
        }
        return {
            mail: result[0].mail,
            consent: result[0].consent
        };
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findNewsletterByMail = findNewsletterByMail;
/**
* Inserts a new newsletter entry into the database.
* @param {Newsletter} { mail, consent } - The newsletter object containing the email address and consent status.
* @returns {Promise<Newsletter>} - A Promise that resolves with the created newsletter entry or rejects with an error.
* @throws {Error} - Throws an error if there was an issue inserting the newsletter entry into the database.
*/
const createNewsletter = ({ mail, consent }) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = 'INSERT INTO newsletter (mail, consent) VALUES (?, ?)';
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query(sql, [mail, consent]);
        connection.release();
        const id_newsletter = result.insertId;
        return { id_newsletter, mail, consent };
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.createNewsletter = createNewsletter;
/**
* Deletes a newsletter entry from the database by its email address.
* @param {string} mail - The email address of the newsletter entry to be deleted.
* @returns {Promise<boolean>} - A Promise that resolves with a boolean indicating whether the newsletter entry was deleted or not, or rejects with an error.
* @throws {Error} - Throws an error if there was an issue deleting the newsletter entry from the database.
*/
const destroyNewsletter = (mail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query('DELETE FROM newsletter WHERE mail = ?', [mail]);
        connection.release();
        return result.affectedRows !== 0;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.destroyNewsletter = destroyNewsletter;
//# sourceMappingURL=newsletter.js.map