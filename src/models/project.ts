import Joi, { ValidationResult } from 'joi';
import { OkPacket, RowDataPacket } from "mysql2";

import { createDBConnection } from "../config/database";
import {PartialProject, Project} from '../interface/Interface';

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
        date: Joi.string().presence(presence),
        is_highlight: Joi.number().presence(presence)
    }).validate(data, { abortEarly: false });
};

/**
 * Retrieves all the projects from the database.
 * @returns {Promise<Project[]>}
 * @throws {Error}
 */
export const getAllProject = async (): Promise<Project[]> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query('SELECT * FROM project');
        connection.release();
        return result as Project[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
 * Inserts a new project into the database.
 * @param newAttributes - The attributes of the project to insert.
 * @returns {Promise<Project>} - A Promise that resolves with the inserted project or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue inserting the project.
 */
export const createProject = async (newAttributes: Project): Promise<Project> => {
    const {name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date, is_highlight} = newAttributes;

    const sql = 'INSERT INTO project (name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date, is_highlight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    try {
        console.log('try model')
        const connection = await createDBConnection();
        const [result] = await connection.query<OkPacket>(sql, [name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date, is_highlight]);
        connection.release();
        const id_project = result.insertId;

        console.log(result)

        return {id_project, name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date, is_highlight} as Project;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
 * Return project highlighted
 * @returns {Promise<Project[]>}
 * @throws {Error}
 */
export const getProjectHighlighted = async (): Promise<Project[]> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM project WHERE is_highlight = 1');
        connection.release();
        return result as Project[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Retrieves a page of projects from the database based on the project type.
* @param {number} page - The page number.
* @param {string} type - The project type.
* @returns {Promise<Project[]>}
* @throws {Error}
*/
export const getProjectPageByType = async (page: number, type: string): Promise<Project[]> => {
    const limit = 6;
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM project WHERE type_projet = ? LIMIT ?, ?`;
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
* @param {string} gender - The gender to match.
* @returns {Promise<Project[]>}
* @throws {Error}
*/
export const getProjectByGender = async (gender: string): Promise<Project[]> => {
    const sql = 'SELECT * FROM project WHERE gender = ?';
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
* @param {string} label - The label of the project to retrieve.
* @returns {Promise<Project>}
* @throws {Error}
*/
export const getProjectByLabel = async (label: string): Promise<Project | null> => {
    const sql = 'SELECT * FROM project WHERE label = ?';
  
    try {
      const connection = await createDBConnection();
      const [result] = await connection.query<RowDataPacket[]>(sql, [label]);
      connection.release();
        if (result.length > 0) {
            return result[0] as Project;
        } else {
            return null;
        }
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};

/**
 * Retrieves a project from the database based on id.
 * @param {number} id - The id of the project to retrieve.
 * @returns {Promise<Project>}
 * @throws {Error}
 */
export const getProjectById = async (id: number): Promise<Project | null> => {
    const sql = 'SELECT * FROM project WHERE id_project = ?';

    try {
        const connection = await createDBConnection();
        const [result] = await connection.query<RowDataPacket[]>(sql, [id]);
        connection.release();
        if (result.length > 0) {
            return result[0] as Project;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Updates an existing project in the database.
* @param {number} id - The ID of the project to update.
* @param {PartialProject} newAttributes
* @throws {Error}
*/
export const updateProjectById = async (id: number, newAttributes: PartialProject): Promise<void> => {
    try {
        const connection = await createDBConnection();

        const setClause = Object.keys(newAttributes)
            .map((key) => `${key} = ?`)
            .join(', ');

        const values = Object.values(newAttributes);

        const sql = `UPDATE project SET ${setClause} WHERE id_project = ?`;

        await connection.query(sql, [...values, id]);
        connection.release();
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Delete a project from the database.
* @param {number} id - The id of the project to be deleted.
* @returns {Promise<boolean>}
* @throws {Error}
*/
export const deleteProjectById = async (id: number): Promise<boolean> => {
    try {
      const connection = await createDBConnection();
      const [result] = await connection.query<OkPacket>('DELETE FROM project WHERE id_project = ?', [id]);
      connection.release();
      return result.affectedRows !== 0;
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};
