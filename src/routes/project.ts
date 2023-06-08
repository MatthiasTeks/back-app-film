import express, { Request, Response } from 'express';
import multer from "multer";
import { uploadFilesToS3} from "../services/UploadToS3";
import { sendResponse } from "../services/SendResponse";

import {
    validateProject,
    getProjectById,
    getProjectByLabel,
    getAllProject,
    getProjectHighlighted,
    getProjectPageByType,
    createProject,
    updateProjectById,
    deleteProjectById
} from "../models/project";
import {SignProject} from "../helpers/SignProject";

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
        const projects = await getAllProject();
        if(projects){
            const signedProjects = await Promise.all(projects.map(async (project) => {
                return SignProject(project);
            }));
            sendResponse(res, signedProjects, 'project not found');
        } else {
            sendResponse(res, null, 'project not found');
        }
    } catch (err) {
        console.error('Error retrieving project from database:', err);
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
        const projects = await getProjectHighlighted();
        if(projects){
            const signedProjects = await Promise.all(projects.map(async (project) => {
                return SignProject(project);
            }));
            sendResponse(res, signedProjects, 'project not found');
        }
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
projectRouter.post('/create', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body)
        const validationResult = validateProject(req.body);
        if (validationResult.error) {
            console.log('validationError')
            res.status(422).json({ validation: validationResult.error });
        } else {
            console.log('validationGood')
            const lowercaseLabel = req.body.label.toLowerCase();
            const projectExist = await getProjectByLabel(lowercaseLabel);
            if (projectExist) {
                console.log('projectExist')
                res.status(409).json({ message: "Project with the same name already exists" });
            } else {
                console.log('projectDontExist')
                const createdProject = await createProject(req.body);
                if(createdProject){
                    console.log('created')
                    res.status(201).json(createdProject);
                } else {
                    console.log('doesnt created')
                    res.status(404).json({ message: "Erreur lors de la création du model" });
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
        const projects = await getProjectPageByType(page, type)
        if(projects){
            const signedProjects = await Promise.all(projects.map(async (project) => {
                return SignProject(project);
            }));
            sendResponse(res, signedProjects, 'project not found');
        }
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
        if(project){
            const signedProject = await SignProject(project);
            sendResponse(res, signedProject, 'project not found');
        }
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

export default projectRouter;