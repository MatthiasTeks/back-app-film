import express, { Request, Response } from 'express';
import argon2 from 'argon2';
import { NextFunction } from 'express';

interface HashingOptions {
    type: 0 | 1 | 2;
    memoryCost: number;
    iterations: number;
    parallelism: number;
    hashLength: number;
}

export const hashingOptions: HashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    iterations: 3,
    parallelism: 2,
    hashLength: 50,
};

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password } = req.body;
  
      if (!password) {
        throw new Error('Missing password');
      }
  
      const hashedPassword = await argon2.hash(password, hashingOptions);
  
      req.body.password = hashedPassword;
  
      next();
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).send('Error hashing password');
    }
  };

export const verifyUserPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    if (!hashedPassword) {
        throw new Error('Invalid hashed password');
    }

    try {
        return await argon2.verify(hashedPassword, plainPassword, hashingOptions);
    } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe: ', error);
        throw error;
    }
};