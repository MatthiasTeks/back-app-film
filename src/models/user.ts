import {RowDataPacket} from "mysql2";
import argon2 from 'argon2';

import { getDBConnection } from "../config/database";

import { User } from "../interface/Interface";

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

/**
 * Finds user by his email address.
 * @param {string} mail - The email address of the admin user to find.
 * @returns {Promise<Admin | undefined>}
 * @throws {Error}
 */
export const getUserByMail = async (mail: string): Promise<User | undefined> => {
    try {
        const connection = await getDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM user WHERE mail = ?', [mail]);
        connection.release();
        if (result.length === 0) {
            return undefined;
        }
        return {
            mail: result[0].mail,
            password: result[0].password,
            is_admin: result[0].is_admin
        };
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
 * Verifies if a given plain password matches a hashed password using Argon2.
 * @param {string} plainPassword - The plain text password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the plain password matches the hashed password, or false otherwise.
 * @throws {Error} - If there's an error during the verification process, the error will be logged and thrown.
 */
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