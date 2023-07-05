import { Request, Response, NextFunction } from 'express';

interface BaseModel<T> {
    (value: any): Promise<T>;
  }

export const checkDuplicateMiddleware = <T>(model: BaseModel<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const alreadyExist: T = await model(req.body.label);
            if (alreadyExist) {
                return res.status(409).json({ message: "Project with the same name already exists" });
            }
            next()
        } catch (err) {
            return res.status(500).json({ message: 'Error checking duplicate', error: err });
        }
    } 
}