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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Home = require('../models/home');
const homeRouter = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let fileExist = fs_1.default.existsSync(path_1.default.join('assets/home', file.originalname));
        if (fileExist) {
            let error = new Error('File already exists');
            return cb(error, '');
        }
        else {
            cb(null, 'assets/home');
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
/**
* Retrieve home media video.
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/media', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const media = yield Home.findMedia();
        if (media) {
            res.status(200).json(media);
        }
        else {
            res.status(404).json({ message: 'media not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving media from database', error: err });
    }
}));
/**
* Update home media video.
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/media/update', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let file = req.file;
    try {
        const media = yield Home.updateMedia(file.filename);
        if (media) {
            res.status(200).json(media);
        }
        else {
            res.status(404).json({ message: 'media not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating media from database', error: err });
    }
}));
/**
* Retrieve actor from home page.
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/actor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const actors = yield Home.findActor();
        if (actors) {
            res.status(200).json(actors);
        }
        else {
            res.status(404).json({ message: 'actors_home not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving actors_home from database', error: err });
    }
}));
/**
* Update actor in home page
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/actor/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { actorList, actorHome } = req.body;
    try {
        const updateActor = yield Home.updateActor(actorList, actorHome);
        if (updateActor) {
            res.status(200).json(updateActor);
        }
        else {
            res.status(404).json({ message: 'updateActor not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating updateActor from database', error: err });
    }
}));
/**
* Get news from home page
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/news', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield Home.findNews();
        if (news) {
            res.status(200).json(news);
        }
        else {
            res.status(404).json({ message: 'news_home not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving news_home from database', error: err });
    }
}));
/**
* Get partner from home page
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.get('/partner', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partner = yield Home.findPartner();
        if (partner) {
            res.status(200).json(partner);
        }
        else {
            res.status(404).json({ message: 'partner_home not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving partner_home from database', error: err });
    }
}));
/**
* Update partner from home page
* @async
* @function
* @param {Request} req - The client request.
* @param {Response} res - The server response.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
homeRouter.post('/partner/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, media, idPartner } = req.body;
    try {
        const updatePartner = yield Home.updatePartner(name, media, idPartner);
        if (updatePartner) {
            res.status(200).json(updatePartner);
        }
        else {
            res.status(404).json({ message: 'updatePartner not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating updatePartner from database', error: err });
    }
}));
exports.default = homeRouter;
