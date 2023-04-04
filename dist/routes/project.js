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
const config_1 = require("../config");
const client_s3_1 = require("@aws-sdk/client-s3");
const UploadToS3_1 = require("../services/UploadToS3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const UploadToS3_2 = require("../services/UploadToS3");
const SendResponse_1 = require("../services/SendResponse");
const project_1 = require("../models/project");
const projectRouter = express_1.default.Router();
// Multer storage configuration for handling file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
/**
* Gets all project records.
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projectRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield (0, project_1.findAllProject)();
        (0, SendResponse_1.sendResponse)(res, project, 'project not found');
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err });
    }
}));
/**
* Creates a new project record with the provided data and upload files images and video to S3 Bucket.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with the created project record or rejects with an error.
* @throws {Error} - Throws an error if the provided data is invalid or if a project with the same name already exists.
*/
projectRouter.post('/create', upload.fields([
    { name: 's3_image_main' },
    { name: 's3_image_2' },
    { name: 's3_image_3' },
    { name: 's3_image_horizontal' },
    { name: 's3_video_projet' },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = (0, project_1.validateProject)(req.body);
        if (validationResult.error) {
            res.status(422).json({ validation: validationResult.error });
        }
        else {
            const lowercaseLabel = req.body.label.toLowerCase();
            const projectExist = yield (0, project_1.findProjectByLabel)(lowercaseLabel);
            if (projectExist) {
                res.status(409).json({ message: "Project with the same name already exists" });
            }
            else {
                if (typeof req.files === 'object' && !Array.isArray(req.files)) {
                    const fileKeys = yield Promise.all(Object.values(req.files).map((fileArray) => __awaiter(void 0, void 0, void 0, function* () {
                        const file = fileArray[0];
                        const fileUrl = yield (0, UploadToS3_2.uploadFileToS3)(file);
                        return fileUrl.split('/').pop();
                    })));
                    const [s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key] = fileKeys;
                    const projectData = Object.assign(Object.assign({}, req.body), { s3_image_main_key,
                        s3_image_2_key,
                        s3_image_3_key,
                        s3_image_horizontal_key,
                        s3_video_projet_key });
                    const createdProject = yield (0, project_1.createProject)(projectData);
                    res.status(201).json(createdProject);
                }
                else {
                    res.status(400).json({ message: 'Invalid file data' });
                }
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error saving the Project', error: err });
    }
}));
/**
* Get page of project records based on the specified page number and project type.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with a page of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projectRouter.get('/page', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page, 10);
        const type = req.query.type;
        const project = yield (0, project_1.findPageProjectOnType)(page, type);
        (0, SendResponse_1.sendResponse)(res, project, 'project not found');
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err });
    }
}));
/**
* Get all project records with the specified gender.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projectRouter.get('/gender/:gender', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gender = req.params.gender;
        const project = yield (0, project_1.findProjectByGender)(gender);
        (0, SendResponse_1.sendResponse)(res, project, 'project not found');
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err });
    }
}));
/**
* Get a project record by label.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with the project record or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project record.
*/
projectRouter.get('/label/:label', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.params.label;
        const project = yield (0, project_1.findProjectByLabel)(name);
        (0, SendResponse_1.sendResponse)(res, project, 'project not found');
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err });
    }
}));
/**
 * Update project record by id.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves with the project record or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the project record.
 */
projectRouter.put('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const newAttributes = req.body;
        const projectValidate = (0, project_1.validateProject)(newAttributes, false);
        if (projectValidate.error) {
            res.status(422).json({ validation: projectValidate.error });
        }
        else {
            const project = yield (0, project_1.findProjectById)(id);
            if (!project) {
                res.status(404).json({ message: 'Project not found' });
            }
            else {
                yield (0, project_1.updateProject)(id, newAttributes);
                const updatedProject = yield (0, project_1.findProjectById)(id);
                res.status(200).json(updatedProject);
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating project', error: err });
    }
}));
/**
 * Delete project record by id.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves with the project record or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the project record.
 */
projectRouter.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const project = yield (0, project_1.findProjectById)(id);
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
        }
        else {
            const result = yield (0, project_1.destroyProject)(id);
            if (result) {
                res.status(204).send();
            }
            else {
                res.status(500).json({ message: 'An error occurred while deleting the project' });
            }
        }
    }
    catch (error) {
        console.error('An error occurred while deleting the project: ', error);
        res.status(500).json({ message: 'An error occurred while deleting the project' });
    }
}));
/**
 * Get a signed URL for a video associated with a project.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves with the signed URL or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the project or generating the signed URL.
 */
projectRouter.get('/:label/sign-url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const label = req.params.label;
        const project = yield (0, project_1.findProjectByLabel)(label);
        if (project) {
            const videoName = project.s3_video_projet_key;
            const params = {
                Bucket: config_1.config.bucket_name,
                Key: videoName,
                Expires: 60 * 60
            };
            try {
                const command = new client_s3_1.GetObjectCommand(params);
                const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(UploadToS3_1.s3, command, { expiresIn: 60 * 60 });
                res.status(200).json({ signedUrl });
            }
            catch (err) {
                res.status(500).json({ message: 'Error generating signed URL', error: err });
            }
        }
        else {
            res.status(404).json({ message: 'Project not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err });
    }
}));
exports.default = projectRouter;
//# sourceMappingURL=project.js.map