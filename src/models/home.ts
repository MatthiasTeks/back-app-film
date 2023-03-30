// import Joi from 'joi';
import { OkPacket, RowDataPacket } from "mysql2";

import { createDBConnection } from "../config/database";

import { HomeActor, HomeMedia, HomeNews, HomePartner } from "../interface/Interface";

// /**
//  * Validate media data
//  * @param data
//  * @param forCreation
//  * @returns {ValidationError}
//  */
// export const validateMedia = (data: any, forCreation = true): Joi.ValidationError | undefined => {
//     const presence = forCreation ? 'required' : 'optional';
//     return Joi.object({
//         id_home_media: Joi.number(),
//         lien: Joi.string().max(255).presence(presence),
//         poster: Joi.string().max(255).presence(presence)
//     }).validate(data, { abortEarly: false }).error;
// };

// /**
//  * Validate actor data
//  * @param data
//  * @param forCreation
//  * @returns {ValidationError}
//  */
// export const validateActor = (data: any, forCreation = true): Joi.ValidationError | undefined => {
//     const presence = forCreation ? 'required' : 'optional';
//     return Joi.object({
//         id_home_actor: Joi.number(),
//         actor_id: Joi.number().presence(presence)
//     }).validate(data, { abortEarly: false }).error;
// };

// /**
//  * Validate news data
//  * @param data
//  * @param forCreation
//  * @returns {ValidationError}
//  */
// export const validateNews = (data: any, forCreation = true): Joi.ValidationError | undefined => {
//     const presence = forCreation ? 'required' : 'optional';
//     return Joi.object({
//         id_news: Joi.number(),
//         name: Joi.string().max(255).presence(presence),
//         resume: Joi.string().max(500).presence(presence),
//         date: Joi.date().presence(presence),
//         media: Joi.string().max(255).presence(presence),
//         isInsta: Joi.number().max(10).presence(presence),
//         linkInsta: Joi.string().max(255)
//     }).validate(data, { abortEarly: false }).error;
// };

// /**
//  * Validate partner data
//  * @param data
//  * @param forCreation
//  * @returns {ValidationError}
//  */
// export const validatePartner = (data: any, forCreation = true): Joi.ValidationError | undefined => {
//     const presence = forCreation ? 'required' : 'optional';
//     return Joi.object({
//         id_partner: Joi.number(),
//         name: Joi.string().max(255).presence(presence),
//         media: Joi.string().max(255).presence(presence)
//     }).validate(data, { abortEarly: false }).error;
// };

/* -------- HOME MEDIA SECTION -------- */

/**
 * Return media from home page
 * @returns {Promise<HomeMedia[]>} - A Promise that resolves with an array of all medias or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
export const findMedia = async (): Promise<HomeMedia[]> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM home_media');
        connection.release();
        return result.map(row => ({
            id_home_media: row.id_home_media,
            s3_video_key: row.s3_video_key
        })) as HomeMedia[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

// /**
//  * Update media from home page
//  * @returns {Promise<HomeMedia[]>} - A Promise that resolves with an array of all medias or rejects with an error.
//  * @throws {Error} - Throws an error if there was an issue retrieving the projects.
//  */
// export const updateMedia = async (file: string): Promise<any> => {
//     try {
//         const connection = await createDBConnection();
//         const [result] = await connection.query('UPDATE home_media SET s3_video_key = ? WHERE id_home_media = 1', [file]);
//         connection.release();
//         return result;
//     } catch (error) {
//         console.error('Erreur lors de la requête: ', error);
//         throw error;
//     }
// };

/**
 * Return actors from home page
 * @returns {Promise<HomeActor[]>} - A Promise that resolves with an array of all actors or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
export const findActor = async (): Promise<HomeActor[]> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT home_actors.*, projet.* FROM home_actors JOIN projet ON home_actors.projet_id = projet.id_project ORDER BY home_actors.id_home_actors');
        connection.release();
        return result.map(row => ({
            id_home_actors: row.id_home_actors,
            projet_id: row.projet_id
        })) as HomeActor[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
 * Update actor home depend on his carousel position and his project id
 * @returns {Promise<HomeActor[]>} - A Promise that resolves with an array of all the projects or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
export const updateActor = async (actorList: number, actorHome: number): Promise<void> => {
    try {
        const connection = await createDBConnection();
        await connection.query<OkPacket>('UPDATE home_actors SET projet_id = ? WHERE id_home_actors = ?', [actorList, actorHome]);
        connection.release();
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
 * Return all news from home page
 * @returns {Promise<HomeNews[]>} - A Promise that resolves with an array of all news or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
export const findNews = async (): Promise<HomeNews[]> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM home_news');
        connection.release();
        return result as HomeNews[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

// /**
//  * Update news from home page
//  * @returns {Promise<HomeNews[]>} - A Promise that resolves with an array of all news or rejects with an error.
//  * @throws {Error} - Throws an error if there was an issue retrieving the projects.
//  */
// export const updateNews = async (name: string, resume: string, date: Date, s3_image_key: string, isInsta: boolean, linkInsta: string | null, idNews: number): Promise<void> => {
//     try {
//         const connection = await createDBConnection();
//         await connection.query('UPDATE home_news SET name = ?, resume = ?, date = ?, s3_image_key = ?, isInsta = ?, linkInsta = ? WHERE id_news = ?', [name, resume, date, s3_image_key, isInsta, linkInsta, idNews]);
//         connection.release();
//     } catch (error) {
//         console.error('Erreur lors de la requête: ', error);
//         throw error;
//     }
// };

/**
 * Return all partner from home page
 * @returns {Promise<HomePartner[]>} - A Promise that resolves with an array of all partners or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the partners.
 */
export const findPartner = async (): Promise<HomePartner[]> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM home_partner');
        connection.release();
        return result as HomePartner[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
 * Update partner from home page
 * @returns {Promise<HomePartner[]>} - A Promise that resolves with an array of all partners or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the partners.
 */
export const updatePartner = async (name: string, s3_image_key: string, idPartner: number): Promise<void> => {
    try {
        const connection = await createDBConnection();
        await connection.query('UPDATE home_partner SET name = ?, s3_image_key = ? WHERE id_partner = ?', [name, s3_image_key, idPartner]);
        connection.release();
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};
