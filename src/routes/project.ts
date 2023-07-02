import express, { Request, Response } from 'express';
import Joi, { Schema } from 'joi';
import { sendResponse } from "../services/SendResponse";
import { SignProject } from "../helpers/SignProject";
import { Project } from '../interface/Interface';
import {
    getProjectById,
    getProjectByLabel,
    getAllProject,
    getProjectHighlighted,
    getProjectPageByType,
    createProject,
    updateProjectById,
    deleteProjectById
} from "../models/project";

const validateProject = (data: any) => {
    const schema: Schema<Project> = Joi.object({
        name: Joi.string().required(),
        label: Joi.string().required(),
        type: Joi.string().required(),
        journey: Joi.string().required(),
        s3_image_key: Joi.string().required(),
        s3_video_key: Joi.string().required(),
        date: Joi.string().required(),
        place: Joi.string().optional(),
        credit: Joi.string().optional(),
        is_highlight: Joi.number().valid(0, 1).required(),
    });

    return schema.validate(data);
};

const projectRouter = express.Router();

projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const projects: Project[] = await getAllProject();
        if(projects.length){
            const signedProjects = await Promise.all(projects.map(async (project) => {
                return SignProject(project);
            }));
            sendResponse(res, signedProjects, 'projects signed unsuccessful');
        } else {
            sendResponse(res, null, 'no projects found');
        }
    } catch (err) {
        console.error('Error retrieving project from database:', err);
        res.status(500).json({ message: 'Error retrieving project from database', error: err });
    }
});

projectRouter.get('/highlight', async (req: Request, res: Response) => {
    try {
        const projects: Project[] = await getProjectHighlighted();
        if(projects.length){
            const signedProjects = await Promise.all(projects.map(async (project) => {
                return SignProject(project);
            }));
            sendResponse(res, signedProjects, 'highlighted projects signed unsuccessful');
        } else {
            sendResponse(res, null, 'no projects highlighted found');
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving projects highlighted from database', error: err });
    }
});

projectRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const { error } = validateProject(req.body);
        if (error) {
            return res.status(400).json('{ error: error.details }');
        }

        const projectAlreadyExist: Project[] = await getProjectByLabel(req.body.label);
        if (projectAlreadyExist) {
            return res.status(409).json({ message: "Project with the same name already exists" });
        }

        const createdProject: Project | undefined = await createProject(req.body);
        if(createdProject){
            sendResponse(res, createProject, 'projects created successfully');
        } else {
            sendResponse(res, createProject, 'projects signed unsuccessful');
        }
    } catch (err) {
        res.status(500).json({ message: 'Error saving the project', error: err });
    }
});

projectRouter.get('/page', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string, 10);
        const type = req.query.type as string;
        const projects: Project[] = await getProjectPageByType(page, type)
        if(projects.length){
            const signedProjects = await Promise.all(projects.map(async (project) => {
                return SignProject(project);
            }));
            sendResponse(res, signedProjects, 'project not found');
        } else {
            sendResponse(res, null, 'no projects page found');
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project page from database', error: err })
    }
});

projectRouter.get('/label/:label', async (req: Request, res: Response): Promise<void> => {
    try {
        const name = req.params.label as string;
        const project: Project[] = await getProjectByLabel(name)
        if(project.length){
            const signedProject = await SignProject(project[0]);
            sendResponse(res, signedProject, `${name} project can't be signed`);
        } else {
            sendResponse(res, null, `${name} project not found`);
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving project label from database', error: err })
    }
});

projectRouter.put('/update/:id', async (req: Request, res: Response) => {
    try {
        const { error } = validateProject(req.body);
        if (error) {
            return res.status(400).json('{ error: error.details }');
        }

        const id = parseInt(req.params.id as string, 10);

        const project: Project[]  = await getProjectById(id);
        if (project.length) {
            await updateProjectById(id, req.body);
            const updatedProject = await getProjectById(id);
            res.status(200).json(updatedProject);
        } else {
            sendResponse(res, project, `project ${id} not found`);
        }
        
    } catch (err) {
        res.status(500).json({ message: 'Error updating project', error: err });
    }
});

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