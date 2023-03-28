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
const { getConnection } = require('../config/database.js');
const joi_1 = __importDefault(require("joi"));
/**
 * Validate media data
 * @param data
 * @param forCreation
 * @returns {ValidationError}
 */
const validateMedia = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return joi_1.default.object({
        id_home_media: joi_1.default.number(),
        lien: joi_1.default.string().max(255).presence(presence),
        poster: joi_1.default.string().max(255).presence(presence)
    }).validate(data, { abortEarly: false }).error;
};
/**
 * Validate actor data
 * @param data
 * @param forCreation
 * @returns {ValidationError}
 */
const validateActor = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return joi_1.default.object({
        id_home_actor: joi_1.default.number(),
        actor_id: joi_1.default.number().presence(presence)
    }).validate(data, { abortEarly: false }).error;
};
/**
 * Validate news data
 * @param data
 * @param forCreation
 * @returns {ValidationError}
 */
const validateNews = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return joi_1.default.object({
        id_news: joi_1.default.number(),
        name: joi_1.default.string().max(255).presence(presence),
        resume: joi_1.default.string().max(500).presence(presence),
        date: joi_1.default.date().presence(presence),
        media: joi_1.default.string().max(255).presence(presence),
        isInsta: joi_1.default.number().max(10).presence(presence),
        linkInsta: joi_1.default.string().max(255)
    }).validate(data, { abortEarly: false }).error;
};
/**
 * Validate partner data
 * @param data
 * @param forCreation
 * @returns {ValidationError}
 */
const validatePartner = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return joi_1.default.object({
        id_partner: joi_1.default.number(),
        name: joi_1.default.string().max(255).presence(presence),
        media: joi_1.default.string().max(255).presence(presence)
    }).validate(data, { abortEarly: false }).error;
};
/* -------- HOME MEDIA SECTION -------- */
/**
 * Find media
 * @returns {Promise<any>}
 */
const findMedia = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield getConnection();
        const [result] = yield connection.promise().query('SELECT * FROM home_media');
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
/**
 * Update media
 * @param file
 * @returns {Promise<any>}
 */
const updateMedia = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield getConnection();
        const [result] = yield connection.promise().query('UPDATE home_media SET lien = ? WHERE id_home_media = 1', [file]);
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
const findActor = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield getConnection();
        const [result] = yield connection.promise().query('SELECT home_actors.*, projet.* FROM home_actors JOIN projet ON home_actors.projet_id = projet.id_projet ORDER BY home_actors.id_home_actors');
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
const updateActor = (actorList, actorHome) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield getConnection();
        const [result] = yield connection.promise().query('UPDATE home_actors SET projet_id = ? WHERE id_home_actors = ?', [actorList, actorHome]);
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
const findNews = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield getConnection();
        const [result] = yield connection.promise().query('SELECT * FROM home_news');
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
const updateNews = (name, resume, date, media, isInsta, linkInsta, idNews) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield getConnection();
        const [result] = yield connection.promise().query('UPDATE home_news SET name = ?, resume = ?, media = ?, isInsta = ?, linkInsta = ? WHERE id_news = ?', [name, resume, date, media, isInsta, linkInsta, idNews]);
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
const findPartner = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield getConnection();
        const [result] = yield connection.promise().query('SELECT * FROM home_partner');
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
const updatePartner = (name, media, idPartner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield getConnection();
        const [result] = yield connection.promise().query('UPDATE home_partner SET name = ?, media = ? WHERE id_partner = ?', [name, media, idPartner]);
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
module.exports = {
    validateActor,
    validateMedia,
    validateNews,
    validatePartner,
    findMedia,
    findActor,
    findNews,
    findPartner,
    updateMedia,
    updateActor,
    updatePartner,
    updateNews
};
