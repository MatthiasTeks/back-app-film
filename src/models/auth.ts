const { getConnection } = require('../config/database.js');
import { InterfaceAdmin } from '../interface/Interface';
import Joi, { ValidationError } from 'joi';
import argon2 from 'argon2';
import { Buffer } from 'buffer';

interface HashingOptions {
    type?: argon2.argon2id;
    memoryCost?: number;
    timeCost?: number;
    parallelism?: number;
}

/**
* Validates an admin object based on the provided data.
* @function
* @param {Admin} data - The admin object to be validated.
* @param {boolean} [forCreation=true] - A flag to indicate whether the validation is for creation (required fields) or not (optional fields).
* @returns {ValidationError | undefined} - Returns a ValidationError if the data is invalid, otherwise returns undefined.
*/
const validate = (data: InterfaceAdmin, forCreation = true): ValidationError | undefined => {
    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
      email: Joi.string().email().max(255).presence(presence),
      password: Joi.string().min(8).max(50).presence(presence),
    }).validate(data, { abortEarly: false }).error;
};

/**
* Retrieves an admin by email address from the database.
* @async
* @function
* @param {string} email - The email address of the admin to retrieve.
* @returns {Promise<Admin | undefined>} - A Promise that resolves with the admin if found or undefined if not found, or rejects with an error.
* @throws {Error} - Throws an error if there was an issue retrieving the admin from the database.
*/
const findByEmail = async (email: string): Promise<InterfaceAdmin | undefined> => {
    try {
        const connection = await getConnection();
        const [results] = await connection.promise().query('SELECT * FROM admin WHERE email = ?', [email]);
        connection.release();
        return results[0];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Inserts a new admin into the database.
* @async
* @function
* @param {Admin} { email, password } - The admin object containing the email address and password.
* @returns {Promise<Admin>} - A Promise that resolves with the created admin or rejects with an error.
* @throws {Error} - Throws an error if there was an issue inserting the admin into the database.
*/
const create = async ({ email, password }: InterfaceAdmin): Promise<InterfaceAdmin> => {
    const hashedPassword = await hashPassword(password);
    try {
        const connection = await getConnection();
        const [result] = await connection.promise().query('INSERT INTO admin SET ?', {
            email,
            password: hashedPassword,
        });
        connection.release();
        const id = result.insertId;
        return { email, id };
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
* Hashes a plain text password.
* @async
* @function
* @param {string} plainPassword - The plain text password to hash.
* @returns {Promise<string>} - A Promise that resolves with the hashed password or rejects with an error.
* @throws {Error} - Throws an error if there was an issue hashing the password.
*/
const hashPassword = async (plainPassword: string): Promise<string> => {
    try {
        return await argon2.hash(plainPassword, hashingOptions);
    } catch (error) {
        console.error('Erreur lors du hashage du mot de passe: ', error);
        throw error;
    }
};

/**
* Verifies a plain text password against a hashed password.
* @async
* @function
* @param {string} plainPassword - The plain text password to verify.
* @param {string} hashedPassword - The hashed password to compare against.
* @returns {Promise<boolean>} - A Promise that resolves with true if the passwords match, false otherwise, or rejects with an error.
* @throws {Error} - Throws an error if there was an issue verifying the password.
*/
const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await argon2.verify(hashedPassword, plainPassword, hashingOptions);
    } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe: ', error);
        throw error;
    }
};

module.exports = {
    validate,
    findByEmail,
    create,
    hashPassword,
    verifyPassword,
};
