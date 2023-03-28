import Joi, { ValidationResult } from 'joi';
import {OkPacket, RowDataPacket} from "mysql2";

import { Project, PartialProject } from '../interface/Interface';

import {createDBConnection} from "../config/database";

/**
 * Validate the data for a Project object.
 * @param {Project} data - The data to be validated.
 * @param {Boolean} [forCreation=true] - Whether the validation is for a creation or an update of a Project object.
 * @returns {ValidationResult} - The result of the validation.
 */
export const validateProject = (data: Project, forCreation: boolean = true): ValidationResult => {
    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
        id_projet: Joi.number(),
        name: Joi.string().max(255).presence(presence),
        label: Joi.string().max(255).presence(presence),
        gender: Joi.string().max(45).presence(presence),
        type_projet: Joi.string().max(255).presence(presence),
        s3_image_main_key: Joi.string().max(255).presence(presence),
        s3_image_2_key: Joi.string().max(255).presence(presence),
        s3_image_3_key: Joi.string().max(255).presence(presence),
        s3_image_horizontal_key: Joi.string().max(255).presence(presence),
        s3_video_projet_key: Joi.string().max(255).presence(presence),
        date: Joi.string().max(255).presence(presence),
    }).validate(data, { abortEarly: false });
};

/**
 * Retrieves all the projects from the database.
 * @async
 * @function
 * @returns {Promise<Project[]>} - A Promise that resolves with an array of all the projects or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
export const findAllProject = async (): Promise<Project[]> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query('SELECT * FROM projet');
        connection.release();
        return result as Project[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Retrieves a page of projects from the database based on the project type.
* @async
* @function
* @param {number} page - The page number.
* @param {string} type - The project type.
* @returns {Promise<Project[]>} - A Promise that resolves with an array of projects or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the projects.
*/
export const findProjectOnLimit = async (page: number, type: string): Promise<Project[]> => {
    const limit = 6;
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM projet WHERE type_projet = ? LIMIT ?, ?`;
    const values = [type, offset, limit];
  
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query(sql, values);
        connection.release();
        return result as Project[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Retrieves all the projects from the database that match a specific gender.
* @async
* @function
* @param {string} gender - The gender to match.
* @returns {Promise<Project[]>} - A Promise that resolves with an array of matching projects or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the projects.
*/
export const findProjectByGender = async (gender: string): Promise<Project[]> => {
    const sql = 'SELECT * FROM projet WHERE gender = ?';
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query(sql, [gender]);
        connection.release();
        return result as Project[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Retrieves a project from the database based on its label.
* @async
* @function
* @param {string} label - The label of the project to retrieve.
* @returns {Promise<Project>} - A Promise that resolves with the matching project or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project.
*/
export const findProjectByLabel = async (label: string): Promise<Project> => {
    const sql = 'SELECT * FROM projet WHERE label = ?';
  
    try {
      const connection = await createDBConnection();
      const [result] = await connection.query<RowDataPacket[]>(sql, [label]);
      connection.release();
      return result[0] as Project;
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};
  

/**
* Inserts a new project into the database.
* @async
* @function
* @param newAttributes - The attributes of the project to insert.
* @returns {Promise<Project>} - A Promise that resolves with the inserted project or rejects with an error.
* @throws {Error} - Throws an error if there was an issue inserting the project.
*/
export const createProject = async (newAttributes: Project): Promise<Project> => {
    const {name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date} = newAttributes;
  
    const sql = 'INSERT INTO projet (name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
    try {
      const connection = await createDBConnection();
      const [result] = await connection.query<OkPacket>(sql, [name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date]);
      connection.release();
      const id_project = result.insertId;
  
      return {id_project, name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date} as Project;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Updates an existing project in the database.
* @async
* @function
* @param {number} id - The ID of the project to update.
* @param {PartialProject} newAttributes - The new attributes of the project.
* @throws {Error} - Throws an error if there was an issue updating the project.
*/
export const updateProject = async (id: number, newAttributes: PartialProject): Promise<void> => {
    try {
        const connection = await createDBConnection();

        const setClause = Object.entries(newAttributes)
            .map(([key, value]) => `${key} = ${connection.escape(value)}`)
            .join(', ');

        const sql = `UPDATE projet SET ${setClause} WHERE id_project = ?`;

        await connection.query(sql, [id]);
        connection.release();
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Delete a project from the database.
* @async
* @function
* @param {number} id - The id of the project to be deleted.
* @returns {Promise<boolean>} - A Promise that resolves with a boolean indicating whether the project was deleted or not, or rejects with an error.
* @throws {Error} - Throws an error if there was an issue deleting the project from the database.
*/
export const destroyProject = async (id: number): Promise<boolean> => {
    try {
      const connection = await createDBConnection();
      const [result]: any = await connection.query('DELETE FROM projet WHERE id_project = ?', [id]);
      connection.release();
      return result.affectedRows !== 0;
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};
