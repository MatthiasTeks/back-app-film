import { RowDataPacket } from "mysql2";

import { Partner } from "../interface/Interface";
import { getDBConnection } from "../config/database";


/**
 * Return all partner from home page
 * @returns {Promise<Partner[]>}
 * @throws {Error}
 */
export const getAllPartner = async (): Promise<Partner[]> => {
    try {
        const connection = await getDBConnection();
        const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM partner');
        connection.release();
        return result as Partner[];
    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};

/**
 * Update partner from home page
 * @returns {Promise<Partner[]>}
 * @throws {Error}
 */
export const updatePartnerById = async (name: string, s3_image_key: string, idPartner: number): Promise<Partner | null> => {
    try {
        const connection = await getDBConnection();
        await connection.query('UPDATE partner SET name = ?, s3_image_key = ? WHERE id_partner = ?', [name, s3_image_key, idPartner]);

        const [updatedPartnerResult] = await connection.query<RowDataPacket[]>('SELECT * FROM partner WHERE id_partner = ?', [idPartner]);
        connection.release();

        if (updatedPartnerResult.length > 0) {
            return updatedPartnerResult[0] as Partner;
        } else {
            return null
        }

    } catch (error) {
        console.error('Erreur lors de la requête: ', error);
        throw error;
    }
};