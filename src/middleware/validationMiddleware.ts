import { Request, Response, NextFunction } from "express";
import { Schema, ValidationResult } from 'joi';

export const validationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error }: ValidationResult = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details });
    }
    next();
  };
};