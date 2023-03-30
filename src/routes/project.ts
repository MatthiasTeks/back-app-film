import express, { Request, Response } from 'express';
import multer from 'multer';

import {
    validateProject,
    findProjectByLabel,
    findProjectOnLimit,
    findProjectByGender,
    findAllProject,
    createProject,
} from "../models/project";

import { UploadController } from "../controller";
import { multerConfig } from "../controller";
import { s3 } from "../config";

const projectRouter = express.Router();

// Upload file to S3 Bucket
const upload = multer(multerConfig as multer.Options);
projectRouter.post("/upload", upload.single('uploaded_file'), UploadController.Upload);
projectRouter.post("/upload/multiple", upload.array('uploaded_files', 5), UploadController.UploadMultiple);

/**
* Gets all project records.
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const projet = await findAllProject();
        if (projet) {
        res.status(200).json(projet);
        } else {
        res.status(404).json({ message: 'projet not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving projet from database', error: err });
    }
});

/**
* Creates a new project record with the provided data.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with the created project record or rejects with an error.
* @throws {Error} - Throws an error if the provided data is invalid or if a project with the same name already exists.
*/
projectRouter.post('/create', async (req: Request, res: Response): Promise<void> => {
    try {
        const error = validateProject(req.body);
        if (error) {
            res.status(422).json({ validation: error });
        } else {
            const lowercaseName = req.body.actor_name.toLowerCase();
            const userExist = await findProjectByLabel(lowercaseName);
            if (userExist) {
                res.status(409).json({ message: "Projet with the same name already exists" });
            } else {
                const createdProjet = await createProject(req.body);
                res.status(201).json(createdProjet);
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error saving the Projet', error: err });
    }
});

/**
* Gets a page of project records based on the specified page number and project type.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with a page of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projectRouter.get('/page', async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10);
        const type = req.query.type as string;
        const projet = await findProjectOnLimit(page, type)
        if (projet) {
            res.status(200).json(projet)
        } else {
            res.status(404).json({ message: 'projet not found' })
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving projet from database', error: err })
    }
});

/**
* Gets all project records with the specified sex.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projectRouter.get('/gender/:gender', async (req: Request, res: Response): Promise<void> => {
    try {
        const gender = req.params.gender as string;
        const projet = await findProjectByGender(gender)
        if (projet) {
            res.status(200).json(projet)
        } else {
            res.status(404).json({ message: 'projet not found' })
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving projet from database', error: err })
    }
});

/**
* Get a project record by its name.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with the project record or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project record.
*/
projectRouter.get('/:name', async (req: Request, res: Response): Promise<void> => {
    try {
        const name = req.params.name as string;
        const projet = await findProjectByLabel(name)
        if (projet) {
            res.status(200).json(projet)
        } else {
            res.status(404).json({ message: 'projet not found' })
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving projet from database', error: err })
    }
});

/**
 * Get a signed URL for a video associated with a project.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves with the signed URL or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the project or generating the signed URL.
 */
projectRouter.get('/:label/sign-url', async (req: Request, res: Response): Promise<void> => {
    try {
        const label = req.params.label as string;
        const projet = await findProjectByLabel(label);

        if (projet) {
            const videoName = projet.s3_video_projet_key;
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: videoName,
                Expires: 60 * 60
            };

            try {
                const signedUrl = await s3.getSignedUrlPromise('getObject', params);
                res.status(200).json({ signedUrl });
            } catch (err) {
                res.status(500).json({ message: 'Error generating signed URL', error: err });
            }
        } else {
            res.status(404).json({ message: 'Projet not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving projet from database', error: err });
    }
});

export default projectRouter;