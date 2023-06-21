import { OkPacket, RowDataPacket } from "mysql2";
import { getDBConnection } from "../config/database";
import { User } from "../interface/Interface";

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

export const postUser = async (user: User): Promise<User | undefined> => {
    let connection;
    try {
        connection = await getDBConnection();
        const sql = 'INSERT INTO user (mail, password, is_admin) VALUES (?, ?, ?)'
        const [result] = await connection.query<OkPacket>(sql, [user.mail, user.password, user.is_admin]);
        if (result?.affectedRows === 0) {
            return undefined;
        } else {
            return {
                id_user: result.insertId,
                mail: user.mail,
                password: user.password,
                is_admin: user.is_admin
            };
        }
    } catch(error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    } finally {
        connection?.release();
    }
}