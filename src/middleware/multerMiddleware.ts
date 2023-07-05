import { Request } from 'express';
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if(file.mimetype === 'image/webp' || file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export const fileUpload = multer({
    storage: storage,
    fileFilter: fileFilter
})