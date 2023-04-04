import Joi, { ValidationError } from 'joi';
import { RowDataPacket } from "mysql2";

import { createDBConnection } from "../config/database";

import { Newsletter } from "../interface/Interface";

/**
* Validates a newsletter object based on the provided data.
* @param {Newsletter} data - The newsletter object to be validated.
* @param {boolean} [forCreation=true] - A flag to indicate whether the validation is for creation (required fields) or not (optional fields).
* @returns {ValidationError | undefined} - Returns a ValidationError if the data is invalid, otherwise returns undefined.
*/
export const validateNewsletter = (data: Newsletter, forCreation = true): ValidationError | undefined => {
    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
      id_newsletter: Joi.number(),
      mail: Joi.string().max(255).presence(presence),
      consent: Joi.number().max(10).presence(presence),
    }).validate(data, { abortEarly: false }).error;
};

/**
* Retrieves all newsletter entries from the database.
* @returns {Promise<Array<Newsletter>>} - A Promise that resolves with an array of newsletter entries or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the newsletter entries from the database.
*/
export const findAllNewsletter = async (): Promise<Array<Newsletter>> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM newsletter');
        connection.release();
        return result.map(row => ({
            mail: row.mail,
            consent: row.consent
        })) as Newsletter[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Retrieves a newsletter entry by its email address.
* @param {string} mail - The email address of the newsletter entry to retrieve.
* @returns {Promise<Newsletter | undefined>} - A Promise that resolves with the newsletter entry if found or undefined if not found, or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the newsletter entry from the database.
*/
export const findNewsletterByMail = async (mail: string): Promise<Newsletter | undefined> => {
    try {
      const connection = await createDBConnection();
      const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM newsletter WHERE mail = ?', [mail]);
      connection.release();
        if (result.length === 0) {
            return undefined;
        }
        return {
            mail: result[0].mail,
            consent: result[0].consent
        };
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};
 
/**
* Inserts a new newsletter entry into the database.
* @param {Newsletter} { mail, consent } - The newsletter object containing the email address and consent status.
* @returns {Promise<Newsletter>} - A Promise that resolves with the created newsletter entry or rejects with an error.
* @throws {Error} - Throws an error if there was an issue inserting the newsletter entry into the database.
*/
export const createNewsletter = async ({ mail, consent }: Newsletter): Promise<Newsletter> => {
    const sql = 'INSERT INTO newsletter (mail, consent) VALUES (?, ?)';
  
    try {
      const connection = await createDBConnection();
      const [result]: any = await connection.query(sql, [mail, consent]);
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
* @param {string} mail - The email address of the newsletter entry to be deleted.
* @returns {Promise<boolean>} - A Promise that resolves with a boolean indicating whether the newsletter entry was deleted or not, or rejects with an error.
* @throws {Error} - Throws an error if there was an issue deleting the newsletter entry from the database.
*/
export const destroyNewsletter = async (mail: string): Promise<boolean> => {
    try {
      const connection = await createDBConnection();
      const [result]: any = await connection.query('DELETE FROM newsletter WHERE mail = ?', [mail]);
      connection.release();
      return result.affectedRows !== 0;
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};