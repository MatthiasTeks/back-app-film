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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const SendResponse_1 = require("../services/SendResponse");
const home_1 = require("../models/home");
const homeRouter = express_1.default.Router();
// Multer storage configuration for handling file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
/**
* Retrieve home media video.
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the mediaHome or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/media', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const media = yield (0, home_1.findMedia)();
        (0, SendResponse_1.sendResponse)(res, media, 'media not found');
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving media from database', error: err });
    }
}));
/**
 * Update media in home page
 * @param {Request} req - The client request.
 * @param {Response} res - The server response.
 * @returns {Promise<void>} - A Promise that resolves with the updated mediaHome or rejects with an error.
 * @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
 */
homeRouter.post('/media/update', upload.fields([{ name: 's3_video_key' }]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = req.body;
    try {
        const media = yield (0, home_1.updateMedia)(file);
        (0, SendResponse_1.sendResponse)(res, media, 'media not updated');
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating mediaHome from database', error: err });
    }
}));
/**
* Retrieve project from home page.
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/project', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield (0, home_1.findProject)();
        (0, SendResponse_1.sendResponse)(res, project, 'project not found');
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving projects_home from database', error: err });
    }
}));
/**
* Update project in home page
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/project/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { actorList, actorHome } = req.body;
    try {
        const project = yield (0, home_1.updateProject)(actorList, actorHome);
        (0, SendResponse_1.sendResponse)(res, project, 'project not updated');
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating updateActor from database', error: err });
    }
}));
/**
* Get news from home page
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the news or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/news', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield (0, home_1.findNews)();
        (0, SendResponse_1.sendResponse)(res, news, 'news not found');
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving news_home from database', error: err });
    }
}));
/**
 * Update news in home page based on id
 * @param {Request} req - The client request.
 * @param {Response} res - The server response.
 * @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
 * @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
 */
homeRouter.post('/news/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsHome = req.body.news;
    try {
        const news = yield (0, home_1.updateNews)(newsHome);
        (0, SendResponse_1.sendResponse)(res, news, 'news not updated');
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating updateNews from database', error: err });
    }
}));
/**
* Get partner from home page
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with all partner or rejects with an error.
* @throws {Error} - Throws an error if the partners was not found or if the provided data is invalid.
*/
homeRouter.get('/partner', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partner = yield (0, home_1.findPartner)();
        (0, SendResponse_1.sendResponse)(res, partner, 'partner not found');
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving partnerHome from database', error: err });
    }
}));
/**
* Update partner from home page
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/partner/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, media, idPartner } = req.body;
    try {
        const partner = yield (0, home_1.updatePartner)(name, media, idPartner);
        (0, SendResponse_1.sendResponse)(res, partner, 'partner not updated');
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating updatePartner from database', error: err });
    }
}));
exports.default = homeRouter;
//# sourceMappingURL=home.js.map