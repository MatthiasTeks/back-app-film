const { getConnection } = require('../config/database.js');
import Joi, { ValidationResult } from 'joi';
import { InterfaceProject, PartialProject } from '../interfaces/InterfaceProject';

/**
 * Validate the data for a Project object.
 * @param {InterfaceProject} data - The data to be validated.
 * @param {Boolean} [forCreation=true] - Whether the validation is for a creation or an update of a Project object.
 * @returns {ValidationResult} - The result of the validation.
 */
const validate = (data: InterfaceProject, forCreation: boolean = true): ValidationResult => {
    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
      id_projet: Joi.number(),
      actor_name: Joi.string().max(255).presence(presence),
      label: Joi.string().max(255).presence(presence),
      sexe: Joi.string().max(45).presence(presence),
      biography: Joi.string().max(255).presence(presence),
      avis: Joi.string().max(255).presence(presence),
      s3_image_main_key: Joi.string().max(255).presence(presence),
      s3_image_2_key: Joi.string().max(255).presence(presence),
      s3_image_3_key: Joi.string().max(255).presence(presence),
      s3_image_4_key: Joi.string().max(255).presence(presence),
      s3_image_horizontal_key: Joi.string().max(255).presence(presence),
      type_projet: Joi.string().max(255).presence(presence),
      option_projet: Joi.string().max(255).presence(presence),
      s3_image_projet_key: Joi.string().max(255).presence(presence),
      s3_video_projet_key: Joi.string().max(255).presence(presence),
      date: Joi.string().max(255).presence(presence),
    }).validate(data, { abortEarly: false });
};

/**
 * Retrieves all the projects from the database.
 * @async
 * @function
 * @returns {Promise<InterfaceProject[]>} - A Promise that resolves with an array of all the projects or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
const findMany = async (): Promise<InterfaceProject[]> => {
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('SELECT * FROM projet');
        connection.release();
        return result as InterfaceProject[];
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
const findPage = async (page: number, type: string): Promise<InterfaceProject[]> => {
    const limit = 6;
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM projet WHERE type_projet = ? LIMIT ?, ?`;
    const values = [type, offset, limit];
  
    try {
      const connection = await getConnection();
      const [result] = await connection.promise().query(sql, values);
      connection.release();
      return result as InterfaceProject[];
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
const findByGender = async (gender: string): Promise<InterfaceProject[]> => {
    const sql = 'SELECT * FROM projet WHERE gender = ?';
  
    try {
      const connection = await getConnection();
      const [result] = await connection.promise().query(sql, [gender]);
      connection.release();
      return result as InterfaceProject[];
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};

/**
* Retrieves a project from the database based on its label.
* @async
* @function
* @param {string} name - The label of the project to retrieve.
* @returns {Promise<Project>} - A Promise that resolves with the matching project or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project.
*/
const findByName = async (name: string): Promise<InterfaceProject> => {
    const sql = 'SELECT * FROM projet WHERE label = ?';
  
    try {
      const connection = await getConnection();
      const [result] = await connection.promise().query(sql, [name]);
      connection.release();
      return result[0] as InterfaceProject;
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};
  

/**
* Inserts a new project into the database.
* @async
* @function
* @param {NewAttributes} newAttributes - The attributes of the project to insert.
* @returns {Promise<Project>} - A Promise that resolves with the inserted project or rejects with an error.
* @throws {Error} - Throws an error if there was an issue inserting the project.
*/
const create = async (newAttributes: InterfaceProject): Promise<InterfaceProject> => {
    const {actor_name, label, sexe, biography, avis, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_4_key, s3_image_horizontal_key, type_projet, option_projet, s3_image_projet_key, s3_video_projet_key, date} = newAttributes;
  
    const sql = 'INSERT INTO projet (actor_name, label, sexe, biography, avis, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_4_key, s3_image_horizontal_key, type_projet, option_projet, s3_image_projet_key, s3_video_projet_key, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
    try {
      const connection = await getConnection();
      const [result] = await connection
        .promise()
        .query(sql, [actor_name, label, sexe, biography, avis, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_4_key, s3_image_horizontal_key, type_projet, option_projet, s3_image_projet_key, s3_video_projet_key, date]);
      connection.release();
      const id = result.insertId;
  
      return {id, actor_name, label, sexe, biography, avis, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_4_key, s3_image_horizontal_key, type_projet, option_projet, s3_image_projet_key, s3_video_projet_key, date} as InterfaceProject;
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
const update = async (id: number, newAttributes: PartialProject): Promise<void> => {
    try {
      const connection = await getConnection();
      await connection.promise().query('UPDATE projet SET ? WHERE id_projet = ?', [
        newAttributes,
        id,
      ]);
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
const destroy = async (id: number): Promise<boolean> => {
    try {
      const connection = await getConnection();
      const [result]: any = await connection.promise().query('DELETE FROM projet WHERE id_actor = ?', [id]);
      connection.release();
      return result.affectedRows !== 0;
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};

module.exports = {
    validate,
    findMany,
    findByGender,
    findPage,
    findByName,
    create,
    update,
    destroy,
};