import { RowDataPacket } from "mysql2";
import argon2 from 'argon2';

import { createDBConnection } from "../config/database";

import { Admin } from "../interface/Interface";

interface HashingOptions {
    type: 0 | 1 | 2;
    memoryCost: number;
    timeCost: number;
    parallelism: number;
    hashLength: number;
}

export const hashingOptions: HashingOptions = {
    type: argon2.argon2d,
    memoryCost: 2 ** 16,
    timeCost: 10,
    parallelism: 2,
    hashLength: 50,
};

/**
 * Finds an admin user by their email address.
 * @param {string} mail - The email address of the admin user to find.
 * @returns {Promise<Admin | undefined>} A promise that resolves to an Admin object or undefined if no admin is found.
 * @throws {Error} Will throw an error if there is an issue with the database query.
 */
export const findAdminByMail = async (mail: string): Promise<Admin | undefined> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM admin WHERE mail = ?', [mail]);
        connection.release();
        if (result.length === 0) {
            return undefined;
        }
        return {
            mail: result[0].mail,
            password: ''
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
export const verifyAdminPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await argon2.verify(hashedPassword, plainPassword, hashingOptions);
    } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe: ', error);
        throw error;
    }
};