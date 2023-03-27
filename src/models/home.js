const Joi = require('joi');
const {getConnection} = require("../config/database.js");

const validateMedia = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional'
    return Joi.object({
        id_home_media: Joi.number(),
        lien: Joi.string().max(255).presence(presence),
        poster: Joi.string().max(255).presence(presence)
    }).validate(data, { abortEarly: false }).error
};

const validateActor = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional'
    return Joi.object({
        id_home_actor: Joi.number(),
        actor_id: Joi.number().presence(presence)
    }).validate(data, { abortEarly: false }).error
};

const validateNews = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional'
    return Joi.object({
        id_news: Joi.number(),
        name: Joi.string().max(255).presence(presence),
        resume: Joi.string().max(500).presence(presence),
        date: Joi.date().presence(presence),
        media: Joi.string().max(255).presence(presence),
        isInsta: Joi.number().max(10).presence(presence),
        linkInsta: Joi.string().max(255)
    }).validate(data, { abortEarly: false }).error
};

const validatePartner = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional'
    return Joi.object({
        id_partner: Joi.number(),
        name: Joi.string().max(255).presence(presence),
        media: Joi.string().max(255).presence(presence)
    }).validate(data, { abortEarly: false }).error
};

/* -------- HOME MEDIA SECTION -------- */

const findMedia = async () => {
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('SELECT * FROM home_media');
        connection.release();
        return result;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

const updateMedia = async (file) => {
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('UPDATE home_media SET lien = ? WHERE id_home_media = 1', [file]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

const findActor = async () => {
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('SELECT home_actors.*, projet.* FROM home_actors JOIN projet ON home_actors.projet_id = projet.id_projet ORDER BY home_actors.id_home_actors');
        connection.release();
        return result;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

const updateActor = async (actorList, actorHome) => {
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('UPDATE home_actors SET projet_id = ? WHERE id_home_actors = ?', [actorList, actorHome]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

const findNews = async () => {
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('SELECT * FROM home_news');
        connection.release();
        return result;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

const updateNews = async (name, resume, date, media, isInsta, linkInsta, idNews) => {
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('UPDATE home_news SET name = ?, resume = ?, media = ?, isInsta = ?, linkInsta = ? WHERE id_news = ?', [name, resume, date, media, isInsta, linkInsta, idNews]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

const findPartner = async () => {
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('SELECT * FROM home_partner');
        connection.release();
        return result;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

const updatePartner = async (name, media, idPartner) => {
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('UPDATE home_partner SET name = ?, media = ? WHERE id_partner = ?', [name, media, idPartner]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

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
}