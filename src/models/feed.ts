import { OkPacket, RowDataPacket } from "mysql2";

import { Feed } from "../interface/Interface";
import { createDBConnection } from "../config/database";

/**
 * Return all feed from home page
 * @returns {Promise<Feed[]>}
 * @throws {Error}
 */
export const getAllFeed = async (): Promise<Feed[]> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM feed');
        connection.release();
        return result as Feed[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
 * Update feed from home page
 * @returns {Promise<Feed[]>}
 * @throws {Error}.
 */
export const updateFeedById = async (news: Feed): Promise<Feed | null> => {
    try {
        const connection = await createDBConnection();
        await connection.query<OkPacket>('UPDATE feed SET name = ?, resume = ?, date = ?, s3_image_key = ?, is_link = ?, link = ? WHERE id_feed = ?', [news.name, news.resume, news.date, news.s3_image_key, news.is_link, news.link, news.id_feed]);

        const [updatedNewsResult] = await connection.query<RowDataPacket[]>('SELECT * FROM feed WHERE id_feed = ?', [news.id_feed]);
        connection.release();

        if (updatedNewsResult.length > 0) {
            return updatedNewsResult[0] as Feed;
        } else {
            return null
        }

    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};