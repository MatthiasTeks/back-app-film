import { S3 } from 'aws-sdk';
import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

import { initBucket } from "../services/InitBucket";
import { uploadToS3 } from "../services/UploadToS3";

import { config } from "../config";

export class UploadController {
    static Upload = async (req: Request, res: any) => {

        const s3 = new S3({
            accessKeyId: config.aws_access_key_id,
            secretAccessKey: config.aws_secret_access_key,
        });

        await initBucket(s3);

        const uploadRes = await uploadToS3(s3, req.file);

        if (uploadRes.success) {
            res.status(200).json(uploadRes);
        } else {
            res.status(400).json(uploadRes);
        }
    }
    static UploadMultiple = async (req: Request, res: any) => {

        const s3 = new S3({
            accessKeyId: config.aws_access_key_id,
            secretAccessKey: config.aws_secret_access_key,
        });

        await initBucket(s3);

        const files: Express.Multer.File[] = req.files ? (req.files as Express.Multer.File[]) : [];

        const uploadPromises = files.map(async (file: Express.Multer.File) => {
            const multerFile: { fieldname: string; size: number; originalname: string; mimetype: string; buffer: Buffer; encoding: string } = {
                fieldname: "",
                originalname: file.originalname,
                encoding: "",
                mimetype: file.mimetype,
                size: file.size,
                buffer: (file as unknown) as Buffer,
            };
            return await uploadToS3(s3, multerFile);
        });

        const uploadResults = await Promise.all(uploadPromises);

        res.status(200).json(uploadResults);
    }
}

type FileNameCallback = (error: Error | null, filename: string) => void

export const multerConfig = {
    storage : multer.diskStorage({
        destination: 'uploads/',
        filename: function (req: Request, file: Express.Multer.File, cb: FileNameCallback) {
            cb(null, file.originalname);
        }
    }),

    fileFilter :(req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype === "image/webm" || file.mimetype === "video/mp4") {
            return cb(null, false);
        }
        cb(null, true);
    }
}