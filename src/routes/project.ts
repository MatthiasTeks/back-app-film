import express, { Request, Response } from 'express';
import multer from "multer";
import { config } from "../config";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../services/UploadToS3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { uploadFileToS3 } from "../services/UploadToS3";
import { sendResponse } from "../services/SendResponse";

import {
    validateProject,
    getProjectByGender,
    getProjectById,
    getProjectByLabel,
    getAllProject,
    getProjectHighlighted,
    getProjectPageByType,
    createProject,
    updateProjectById,
    deleteProjectById
} from "../models/project";

const projectRouter = express.Router();

// Multer storage configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage })

/**
* Gets all project records.
* @param {Request} req
* @param {Response} res
* @returns {Promise<void>}
* @throws {Error}
*/
projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const project = await getAllProject();
        console.log(project)
        sendResponse(res, project, 'project not found');
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err });
    }
});

/**
 * Retrieve project highlighted from home page.
 * @param {Request} req
 * @param {Response} res.
 * @returns {Promise<void>}
 * @throws {Error}
 */
projectRouter.get('/highlight', async (req: Request, res: Response) => {
    try {
        const project = await getProjectHighlighted();
        sendResponse(res, project, 'project not found');
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving projects highlighted from database', error: err });
    }
});

/**
* Creates a new project record with the provided data and upload files images and video to S3 Bucket.
* @param {Object} req
* @param {Object} res
* @returns {Promise<void>}
* @throws {Error}
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
            const projectExist = await getProjectByLabel(lowercaseLabel);
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
* @param {Object} req
* @param {Object} res
* @returns {Promise<void>}
* @throws {Error}
*/
projectRouter.get('/page', async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10);
        const type = req.query.type as string;
        const project = await getProjectPageByType(page, type)
        sendResponse(res, project, 'project not found');
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err })
    }
});

/**
* Get all project records with the specified gender.
* @param {Object} req
* @param {Object} res
* @returns {Promise<void>}
* @throws {Error}
*/
projectRouter.get('/gender/:gender', async (req: Request, res: Response): Promise<void> => {
    try {
        const gender = req.params.gender as string;
        const project = await getProjectByGender(gender)
        sendResponse(res, project, 'project not found');
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err })
    }
});

/**
* Get a project record by label.
* @param {Object} req
* @param {Object} res
* @returns {Promise<void>}
* @throws {Error}
*/
projectRouter.get('/label/:label', async (req: Request, res: Response): Promise<void> => {
    try {
        const name = req.params.label as string;
        const project = await getProjectByLabel(name)
        sendResponse(res, project, 'project not found');
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err })
    }
});

/**
 * Update project record by id.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
projectRouter.put('/update/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const newAttributes = req.body;
        const projectValidate = validateProject(newAttributes, false);
        if (projectValidate.error) {
            res.status(422).json({ validation: projectValidate.error });
        } else {
            const project = await getProjectById(id);
            if (!project) {
                res.status(404).json({ message: 'Project not found' });
            } else {
                await updateProjectById(id, newAttributes);
                const updatedProject = await getProjectById(id);
                res.status(200).json(updatedProject);
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating project', error: err });
    }
});

/**
 * Delete project record by id.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
projectRouter.delete('/delete/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const project = await getProjectById(id);
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
        } else {
            const result = await deleteProjectById(id);
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
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
projectRouter.get('/:key/sign-url', async (req: Request, res: Response): Promise<void> => {
    try {
        const key = req.params.key as string;

        const params = {
            Bucket: config.bucket_name,
            Key: key,
            Expires: 60 * 60,
        };

        try {
            await s3.headObject(params);

            const command = new GetObjectCommand(params);
            const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 });
            console.log(signedUrl);
            res.status(200).json({ signedUrl });
        } catch (err) {
            res.status(404).json({ message: 'Error retrieving this file name on our bucket', error: err });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project from database', error: err });
    }
});


export default projectRouter;