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

export const getUserByMail = async (mail: string): Promise<User | undefined> => {
    let connection;
    try {
        connection = await getDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM user WHERE mail = ?', [mail]);
        if (result.length === 0) {
            return undefined;
        } else {
            return {
                mail: result[0].mail,
                password: result[0].password,
                is_admin: result[0].is_admin
            };
        }
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    } finally {
        connection?.release();
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