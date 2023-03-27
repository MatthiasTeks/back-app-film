const { getConnection } = require('../config/database.js');
import Joi, { ValidationError } from 'joi';
import { InterfaceNewsletter } from '../interface/Interface';

/**
* Validates a newsletter object based on the provided data.
* @function
* @param {InterfaceNewsletter} data - The newsletter object to be validated.
* @param {boolean} [forCreation=true] - A flag to indicate whether the validation is for creation (required fields) or not (optional fields).
* @returns {ValidationError | undefined} - Returns a ValidationError if the data is invalid, otherwise returns undefined.
*/
const validate = (data: InterfaceNewsletter, forCreation = true): ValidationError | undefined => {
    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
      id_newsletter: Joi.number(),
      mail: Joi.string().max(255).presence(presence),
      consent: Joi.number().max(10).presence(presence),
    }).validate(data, { abortEarly: false }).error;
};

/**
* Retrieves all newsletter entries from the database.
* @async
* @function
* @returns {Promise<Array<InterfaceNewsletter>>} - A Promise that resolves with an array of newsletter entries or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the newsletter entries from the database.
*/
const findMany = async (): Promise<Array<InterfaceNewsletter>> => {
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('SELECT * FROM newsletter');
        connection.release();
        return result;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
}
};

/**
* Retrieves a newsletter entry by its email address.
* @async
* @function
* @param {string} mail - The email address of the newsletter entry to retrieve.
* @returns {Promise<InterfaceNewsletter | undefined>} - A Promise that resolves with the newsletter entry if found or undefined if not found, or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the newsletter entry from the database.
*/
const findOne = async (mail: string): Promise<InterfaceNewsletter | undefined> => {
    try {
      const connection = await getConnection();
      const [result] = await connection.promise().query('SELECT * FROM newsletter WHERE mail = ?', [mail]);
      connection.release();
      return result[0];
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};
 
/**
* Inserts a new newsletter entry into the database.
* @async
* @function
* @param {InterfaceNewsletter} { mail, consent } - The newsletter object containing the email address and consent status.
* @returns {Promise<InterfaceNewsletter>} - A Promise that resolves with the created newsletter entry or rejects with an error.
* @throws {Error} - Throws an error if there was an issue inserting the newsletter entry into the database.
*/
const create = async ({ mail, consent }: InterfaceNewsletter): Promise<InterfaceNewsletter> => {
    const sql = 'INSERT INTO newsletter (mail, consent) VALUES (?, ?)';
  
    try {
      const connection = await getConnection();
      const [result]: any = await connection.promise().query(sql, [mail, consent]);
      connection.release();
      const id_newsletter = result.insertId;
      return { id_newsletter, mail, consent };
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};

/**
* Deletes a newsletter entry from the database by its email address.
* @async
* @function
* @param {string} mail - The email address of the newsletter entry to be deleted.
* @returns {Promise<boolean>} - A Promise that resolves with a boolean indicating whether the newsletter entry was deleted or not, or rejects with an error.
* @throws {Error} - Throws an error if there was an issue deleting the newsletter entry from the database.
*/
const destroy = async (mail: string): Promise<boolean> => {
    try {
      const connection = await getConnection();
      const [result]: any = await connection.promise().query('DELETE FROM newsletter WHERE mail = ?', [mail]);
      connection.release();
      return result.affectedRows !== 0;
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};
  
export {
    validate,
    findMany,
    findOne,
    create,
    destroy,
};