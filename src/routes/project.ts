import express, { Request, Response } from 'express';
import multer from "multer";
import { config } from "../config";
import { s3 } from "../services/UploadToS3";
import { uploadFileToS3 } from "../services/UploadToS3";

import {
    validateProject,
    findProjectByLabel,
    findPageProjectOnType,
    findProjectByGender,
    findAllProject,
    createProject,
    findProjectById,
    updateProject,
    destroyProject,
} from "../models/project";


const projectRouter = express.Router();

// Multer storage configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage })

/**
* Gets all project records.
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const project = await findAllProject();
        project ? res.status(200).json(project) : res.status(404).json({ message: 'project not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err });
    }
});

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
]), async (req: Request, res: Response): Promise<void> => {
    try {
        const validationResult = validateProject(req.body);
        if (validationResult.error) {
            res.status(422).json({ validation: validationResult.error });
        } else {
            const lowercaseLabel = req.body.label.toLowerCase();
            const projectExist = await findProjectByLabel(lowercaseLabel);
            if (projectExist) {
                res.status(409).json({ message: "Project with the same name already exists" });
            } else {
                if (typeof req.files === 'object' && !Array.isArray(req.files)) {
                    const fileKeys = await Promise.all(Object.values(req.files).map(async (fileArray) => {
                        const file = fileArray[0] as Express.Multer.File;
                        const fileUrl = await uploadFileToS3(file);
                        return fileUrl.split('/').pop();
                    }));

                    const [s3_image_main_key, s3_image_2_key, s3_image_3_key, s3_image_horizontal_key, s3_video_projet_key] = fileKeys;

                    const projectData = {
                        ...req.body,
                        s3_image_main_key,
                        s3_image_2_key,
                        s3_image_3_key,
                        s3_image_horizontal_key,
                        s3_video_projet_key,
                    };

                    const createdProject = await createProject(projectData);
                    res.status(201).json(createdProject);
                } else {
                    res.status(400).json({ message: 'Invalid file data' });
                }
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error saving the Project', error: err });
    }
});

/**
* Get page of project records based on the specified page number and project type.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with a page of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projectRouter.get('/page', async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10);
        const type = req.query.type as string;
        const project = await findPageProjectOnType(page, type)
        project ? res.status(200).json(project) : res.status(404).json({ message: 'project not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err })
    }
});

/**
* Get all project records with the specified gender.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projectRouter.get('/gender/:gender', async (req: Request, res: Response): Promise<void> => {
    try {
        const gender = req.params.gender as string;
        const project = await findProjectByGender(gender)
        project ? res.status(200).json(project) : res.status(404).json({ message: 'project not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err })
    }
});

/**
* Get a project record by label.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with the project record or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project record.
*/
projectRouter.get('/label/:label', async (req: Request, res: Response): Promise<void> => {
    try {
        const name = req.params.label as string;
        const project = await findProjectByLabel(name)
        project ? res.status(200).json(project) : res.status(404).json({ message: 'project not found' });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err })
    }
});

/**
 * Update project record by id.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves with the project record or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the project record.
 */
projectRouter.put('/update/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const newAttributes = req.body;
        const projectValidate = validateProject(newAttributes, false);
        if (projectValidate.error) {
            res.status(422).json({ validation: projectValidate.error });
        } else {
            const project = await findProjectById(id);
            if (!project) {
                res.status(404).json({ message: 'Project not found' });
            } else {
                await updateProject(id, newAttributes);
                const updatedProject = await findProjectById(id);
                res.status(200).json(updatedProject);
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating project', error: err });
    }
});

/**
 * Delete project record by id.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves with the project record or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the project record.
 */
projectRouter.delete('/delete/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const project = await findProjectById(id);
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
        } else {
            const result = await destroyProject(id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(500).json({ message: 'An error occurred while deleting the project' });
            }
        }
    } catch (error) {
        console.error('An error occurred while deleting the project: ', error);
        res.status(500).json({ message: 'An error occurred while deleting the project' });
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
        const project = await findProjectByLabel(label);

        if (project) {
            const videoName = project.s3_video_projet_key;
            const params = {
                Bucket: config.bucket_name,
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
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err });
    }
});

export default projectRouter;