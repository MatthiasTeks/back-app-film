import { OkPacket, RowDataPacket } from "mysql2";

import { Background } from "../interface/Interface";
import { createDBConnection } from "../config/database";
import { deleteFileFromS3, uploadFileToS3 } from "../services/UploadToS3";

/**
 * Return media from home page
 * @returns {Promise<Background[]>}
 * @throws {Error}
 */
export const getBackground = async (): Promise<Background[]> => {
    try {
        const connection = await createDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM background');
        connection.release();
        return result.map(row => ({
            id_background: row.id_background,
            s3_video_key: row.s3_video_key
        })) as Background[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
 * Update media from home page
 * @returns {Promise<Background[]>}
 * @throws {Error}
 */
export const updateBackground = async (file: Express.Multer.File): Promise<any> => {
    try {
        const connection = await createDBConnection();

        console.log(file);

        // Get the old video key
        const [oldVideoRows] = await connection.query<RowDataPacket[]>('SELECT s3_video_key FROM background WHERE id_background = 1');
        const oldVideoKey = oldVideoRows[0].s3_video_key;

        // Upload the new video file to S3
        const newVideoKey = await uploadFileToS3(file);

        // Update the video key in the database
        const [result] = await connection.query<OkPacket>('UPDATE background SET s3_video_key = ? WHERE id_background = 1', [file.originalname]);

        // Delete the old video from S3 if operation update success
        if (result.affectedRows > 0) {
            await deleteFileFromS3(oldVideoKey);
        }

        connection.release();
        return newVideoKey;
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};
