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
exports.destroyProject = exports.updateProject = exports.findProjectById = exports.findProjectByLabel = exports.findProjectByGender = exports.findPageProjectOnType = exports.createProject = exports.findAllProject = exports.validateProject = void 0;
const joi_1 = __importDefault(require("joi"));
const database_1 = require("../config/database");
/**
 * Validate the data for a Project object.
 * @param {Project} data - The data to be validated.
 * @param {Boolean} [forCreation=true] - Whether the validation is for a creation or an update of a Project object.
 * @returns {ValidationResult} - The result of the validation.
 */
const validateProject = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return joi_1.default.object({
        id_projet: joi_1.default.number(),
        name: joi_1.default.string().max(255).presence(presence),
        label: joi_1.default.string().max(255).presence(presence),
        gender: joi_1.default.string().max(45).presence(presence),
        type_projet: joi_1.default.string().max(255).presence(presence),
        s3_image_main_key: joi_1.default.string().max(255).presence(presence),
        s3_image_2_key: joi_1.default.string().max(255).presence(presence),
        s3_image_3_key: joi_1.default.string().max(255).presence(presence),
        s3_image_horizontal_key: joi_1.default.string().max(255).presence(presence),
        s3_video_projet_key: joi_1.default.string().max(255).presence(presence),
        date: joi_1.default.number().presence(presence)
    }).validate(data, { abortEarly: false });
};
exports.validateProject = validateProject;
/**
 * Retrieves all the projects from the database.
 * @returns {Promise<Project[]>} - A Promise that resolves with an array of all the projects or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the projects.
 */
const findAllProject = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query('SELECT * FROM projet');
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findAllProject = findAllProject;
/**
 * Inserts a new project into the database.
 * @param newAttributes - The attributes of the project to insert.
 * @returns {Promise<Project>} - A Promise that resolves with the inserted project or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue inserting the project.
 */
const createProject = (newAttributes) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date } = newAttributes;
    const sql = 'INSERT INTO projet (name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query(sql, [name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date]);
        connection.release();
        const id_project = result.insertId;
        return { id_project, name, label, gender, type_projet, s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key, date };
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.createProject = createProject;
/**
* Retrieves a page of projects from the database based on the project type.
* @param {number} page - The page number.
* @param {string} type - The project type.
* @returns {Promise<Project[]>} - A Promise that resolves with an array of projects or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the projects.
*/
const findPageProjectOnType = (page, type) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = 6;
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM projet WHERE type_projet = ? LIMIT ?, ?`;
    const values = [type, offset, limit];
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query(sql, values);
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findPageProjectOnType = findPageProjectOnType;
/**
* Retrieves all the projects from the database that match a specific gender.
* @param {string} gender - The gender to match.
* @returns {Promise<Project[]>} - A Promise that resolves with an array of matching projects or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the projects.
*/
const findProjectByGender = (gender) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = 'SELECT * FROM projet WHERE gender = ?';
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query(sql, [gender]);
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.findProjectByGender = findProjectByGender;
/**
* Retrieves a project from the database based on its label.
* @param {string} label - The label of the project to retrieve.
* @returns {Promise<Project>} - A Promise that resolves with the matching project or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project.
*/
const findProjectByLabel = (label) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = 'SELECT * FROM projet WHERE label = ?';
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query(sql, [label]);
        connection.release();
        if (result.length > 0) {
            return result[0];
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
exports.findProjectByLabel = findProjectByLabel;
/**
 * Retrieves a project from the database based on id.
 * @param {number} id - The label of the project to retrieve.
 * @returns {Promise<Project>} - A Promise that resolves with the matching project or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the project.
 */
const findProjectById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = 'SELECT * FROM projet WHERE id_project = ?';
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query(sql, [id]);
        connection.release();
        if (result.length > 0) {
            return result[0];
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
exports.findProjectById = findProjectById;
/**
* Updates an existing project in the database.
* @param {number} id - The ID of the project to update.
* @param {PartialProject} newAttributes - The new attributes of the project.
* @throws {Error} - Throws an error if there was an issue updating the project.
*/
const updateProject = (id, newAttributes) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const setClause = Object.keys(newAttributes)
            .map((key) => `${key} = ?`)
            .join(', ');
        const values = Object.values(newAttributes);
        const sql = `UPDATE projet SET ${setClause} WHERE id_project = ?`;
        yield connection.query(sql, [...values, id]);
        connection.release();
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.updateProject = updateProject;
/**
* Delete a project from the database.
* @param {number} id - The id of the project to be deleted.
* @returns {Promise<boolean>} - A Promise that resolves with a boolean indicating whether the project was deleted or not, or rejects with an error.
* @throws {Error} - Throws an error if there was an issue deleting the project from the database.
*/
const destroyProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield (0, database_1.createDBConnection)();
        const [result] = yield connection.query('DELETE FROM projet WHERE id_project = ?', [id]);
        connection.release();
        return result.affectedRows !== 0;
    }
    catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
});
exports.destroyProject = destroyProject;
//# sourceMappingURL=project.js.map