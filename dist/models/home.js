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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePartner = exports.findPartner = exports.updateNews = exports.findNews = exports.updateProject = exports.findProject = exports.updateMedia = exports.findMedia = void 0;
const database_1 = require("../config/database");
const UploadToS3_1 = require("../services/UploadToS3");
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
const findMedia = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query('SELECT * FROM home_media');
        connection.release();
        return result.map(row => ({
            id_home_media: row.id_home_media,
            s3_video_key: row.s3_video_key
        }));
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findMedia = findMedia;
/**
 * Update media from home page
 * @returns {Promise<HomeMedia[]>} - A Promise that resolves with an array of all medias or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
const updateMedia = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        // Get the old video key
        const [oldVideoRows] = yield connection.query('SELECT s3_video_key FROM home_media WHERE id_home_media = 1');
        const oldVideoKey = oldVideoRows[0].s3_video_key;
        // Update the video key in the database
        const [result] = yield connection.query('UPDATE home_media SET s3_video_key = ? WHERE id_home_media = 1', [file]);
        // Delete the old video from S3 if operation update success
        if (result.affectedRows > 0) {
            yield (0, UploadToS3_1.deleteFileFromS3)(oldVideoKey);
        }
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.updateMedia = updateMedia;
/**
 * Return project from home page
 * @returns {Promise<HomeActor[]>} - A Promise that resolves with an array of all projects or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
const findProject = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query('SELECT home_actors.*, projet.* FROM home_actors JOIN projet ON home_actors.projet_id = projet.id_project ORDER BY home_actors.id_home_actors');
        connection.release();
        return result.map(row => ({
            id_home_actors: row.id_home_actors,
            projet_id: row.projet_id
        }));
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findProject = findProject;
/**
 * Update actor home depend on his carousel position and his project id
 * @returns {Promise<HomeActor[]>} - A Promise that resolves with an array of all the projects or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
const updateProject = (actorList, actorHome) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        yield connection.query('UPDATE home_actors SET projet_id = ? WHERE id_home_actors = ?', [actorList, actorHome]);
        const [updatedProjectResult] = yield connection.query('SELECT * FROM home_actors WHERE id_home_actors = ?', [actorHome]);
        connection.release();
        if (updatedProjectResult.length > 0) {
            return updatedProjectResult[0];
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.updateProject = updateProject;
/**
 * Return all news from home page
 * @returns {Promise<HomeNews[]>} - A Promise that resolves with an array of all news or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
const findNews = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query('SELECT * FROM home_news');
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findNews = findNews;
/**
 * Update news from home page
 * @returns {Promise<HomeNews[]>} - A Promise that resolves with an array of updated new or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue update the new.
 */
const updateNews = (news) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        yield connection.query('UPDATE home_news SET name = ?, resume = ?, date = ?, s3_image_key = ?, isInsta = ?, linkInsta = ? WHERE id_news = ?', [news.name, news.resume, news.date, news.s3_image_key, news.isInsta, news.linkInsta, news.id_news]);
        const [updatedNewsResult] = yield connection.query('SELECT * FROM home_news WHERE id_news = ?', [news.id_news]);
        connection.release();
        if (updatedNewsResult.length > 0) {
            return updatedNewsResult[0];
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.updateNews = updateNews;
/**
 * Return all partner from home page
 * @returns {Promise<HomePartner[]>} - A Promise that resolves with an array of all partners or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the partners.
 */
const findPartner = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query('SELECT * FROM home_partner');
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findPartner = findPartner;
/**
 * Update partner from home page
 * @returns {Promise<HomePartner[]>} - A Promise that resolves with an array of all partners or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the partners.
 */
const updatePartner = (name, s3_image_key, idPartner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        yield connection.query('UPDATE home_partner SET name = ?, s3_image_key = ? WHERE id_partner = ?', [name, s3_image_key, idPartner]);
        const [updatedPartnerResult] = yield connection.query('SELECT * FROM home_partner WHERE id_partner = ?', [idPartner]);
        connection.release();
        if (updatedPartnerResult.length > 0) {
            return updatedPartnerResult[0];
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.updatePartner = updatePartner;
//# sourceMappingURL=home.js.map