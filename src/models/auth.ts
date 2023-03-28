import { createDBConnection } from "../config/database";
import Joi, { ValidationError } from 'joi';
import argon2 from 'argon2';
import { Admin } from "../interface/Interface";

interface HashingOptions {
    type?: argon2.ArgonType;
    memoryCost?: number;
    timeCost?: number;
    parallelism?: number;
    hashLength?: number;
}

const hashingOptions: HashingOptions = {
    type: argon2.argon2d,
    memoryCost: 2 ** 16,
    timeCost: 10,
    parallelism: 2,
    hashLength: 50,
};

const validate = (data: Admin, forCreation = true): ValidationError | undefined => {
    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
        mail: Joi.string().email().max(255).presence(presence),
        password: Joi.string().min(8).max(50).presence(presence),
    }).validate(data, { abortEarly: false }).error;
};

const findByEmail = async (mail: string): Promise<Admin | undefined> => {
    try {
        const connection = await createDBConnection();
        const [results] = await connection.query('SELECT * FROM admin WHERE mail = ?', [mail]);
        connection.release();
        return results[0];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await argon2.verify(hashedPassword, plainPassword, hashingOptions);
    } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe: ', error);
        throw error;
    }
};

export {
    Admin,
    validate,
    findByEmail,
    verifyPassword,
};