import { OkPacket, RowDataPacket } from "mysql2";

import { Feed } from "../interface/Interface";
import { getDBConnection } from "../config/database";
import { deleteFileFromS3, uploadFileToS3 } from "../services/UploadToS3";

/**
 * Return all feed from home page
 * @returns {Promise<Feed[]>}
 * @throws {Error}
 */
export const getAllFeed = async (): Promise<Feed[]> => {
    try {
        const connection = await getDBConnection();
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
export const updateFeedById = async (news: Feed, file: Express.Multer.File): Promise<Feed | null> => {
    try {
        const connection = await getDBConnection();

        // retrieve old feed key 
        const [oldFeed] = await connection.query<RowDataPacket[]>('SELECT * FROM feed WHERE id_feed = ?', [news.id_feed]);
        const oldFeedKey = oldFeed[0].s3_image_key;

        // update feed id
        await connection.query<OkPacket>('UPDATE feed SET name = ?, resume = ?, date = ?, s3_image_key = ?, is_instagram = ?, is_facebook = ?, link_instagram = ?, link_facebook = ?, WHERE id_feed = ?', [news.name, news.resume, news.date, file.originalname, news.is_instagram, news.is_facebook, news.link_instagram, news.link_facebook, news.id_feed]);
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM feed WHERE id_feed = ?', [news.id_feed]);

        if (result.length > 0) {
            await uploadFileToS3(file);
            await deleteFileFromS3(oldFeedKey);
            return result[0] as Feed;
        } else {
            return null
        }

    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};