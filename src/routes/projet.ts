import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import Projet from '../models/projet';

const projetRouter = express.Router();

/**
* Amazon S3 service object that provides methods for working with the S3 bucket.
* @type {Object}
*/
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!,
});

/**
* Middleware function that configures multer to upload files to the Amazon S3 bucket.
* @function
* @type {Object}
*/
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'les-films-de-la-bande',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            let fileType = file.mimetype === 'image/webp' ? 'images/' : 'videos/';
            cb(null, fileType + Date.now().toString() + '-' + file.originalname);
        }
    })
});

/**
 * Middleware function that uploads multiple files to the server using the multer package.
 * @function
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function.
 * @throws {Error} - Throws an error if there was an issue uploading the files.
 */
function uploadFiles(req: Request, res: Response, next: NextFunction): void {
    upload.fields([
      { name: 'stringInfo', maxCount: 1 },
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
      { name: 'file5', maxCount: 1 },
      { name: 'file6', maxCount: 1 },
      { name: 'file7', maxCount: 1 },
    ])(req, res, next);
  }

// Extend the Request type to include the fileValidationError property
interface ExtendedRequest extends Request {
    fileValidationError?: string;
    file: Express.Multer.File;
    files: Express.Multer.File[];
  }
  
/**
* Uploads a file to Amazon S3 bucket.
* @async
* @function
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with the uploaded file URLs or rejects with an error.
* @throws {Error} - Throws an error if there was an issue uploading the file or if no file was selected.
*/
projetRouter.post('/upload', uploadFiles, (req: ExtendedRequest, res: Response) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    } else if (!req.file) {
      return res.status(400).json({ error: 'Please select a file' });
    } else {
      const s3Urls = req.files.map((file: any) => file.location);
      const s3_images_projet = s3Urls.slice(0, -1);
      const s3_video_projet = s3Urls[s3Urls.length - 1];
      res.status(200).json({ s3_images_projet, s3_video_projet });
    }
});
  
  
/**
* Gets all project records.
* @async
* @function
* @param {Request} req - The HTTP request object.
* @param {Response} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projetRouter.get('/', async (req: Request, res: Response) => {
    try {
        const projet = await Projet.findMany();
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
* @async
* @function
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with the created project record or rejects with an error.
* @throws {Error} - Throws an error if the provided data is invalid or if a project with the same name already exists.
*/
projetRouter.post('/create', async (req: Request, res: Response): Promise<void> => {
    try {
        const error = Projet.validate(req.body);
        if (error) {
            res.status(422).json({ validation: error.details });
        } else {
            const lowercaseName = req.body.actor_name.toLowerCase();
            const userExist = await Projet.findOne(lowercaseName);
            if (userExist) {
                res.status(409).json({ message: "Projet with the same name already exists" });
            } else {
                const createdProjet = await Projet.create(req.body);
                res.status(201).json(createdProjet);
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error saving the Projet', error: err });
    }
});

/**
* Gets a page of project records based on the specified page number and project type.
* @async
* @function
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with a page of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projetRouter.get('/page', async (req: Request, res: Response): Promise<void> => {
    try {
        const page = req.query.page as string;
        const type = req.query.type as string;
        const projet = await Projet.findPage(page, type)
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
* @async
* @function
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with an array of project records or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project records.
*/
projetRouter.get('/sexe/:sexe', async (req: Request, res: Response): Promise<void> => {
    try {
        const sexe = req.params.sexe as string;
        const projet = await Projet.findSexe(sexe)
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
* @async
* @function
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with the project record or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the project record.
*/
projetRouter.get('/:name', async (req: Request, res: Response): Promise<void> => {
    try {
        const name = req.params.name as string;
        const projet = await Projet.findOne(name)
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
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves with the signed URL or rejects with an error.
 * @throws {Error} - Throws an error if there was an issue retrieving the project or generating the signed URL.
 */
projetRouter.get('/:name/sign-url', async (req: Request, res: Response): Promise<void> => {
    try {
        const name = req.params.name as string;
        const projet = await Projet.findOne(name);

        if (projet) {
            const videoName = projet.videoName;
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

/**
* Update a project record with the provided data.
* @async
* @function
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
* @returns {Promise<void>} - A Promise that resolves with the updated project or rejects with an error.
* @throws {Error} - Throws an error if the record was not found or if the provided data is invalid.
*/
projetRouter.put('/:id', async (req: Request, res: Response): Promise<void> => {
    let validationErrors: any;
    try {
        let existingprojet = null;
        existingprojet = await Projet.findOne(req.params.id);
        if (!existingprojet) throw 'RECORD_NOT_FOUND';
        validationErrors = Projet.validate(req.body, false);
        if (validationErrors) throw 'INVALID_DATA';
        await Projet.update(req.params.id, req.body);
        res.status(200).json({ ...existingprojet, ...req.body });
    } catch (err) {
        console.error(err);
        if (err === 'RECORD_NOT_FOUND') {
            res.status(404).json({ message: `projet with id ${req.params.id} not found.` });
        } else if (err === 'INVALID_DATA') {
            res.status(422).json({ validationErrors: validationErrors.details });
        } else {
            res.status(500).json({ message: 'Error updating projet from database', error: err });
        }
    }
});

export default projetRouter;