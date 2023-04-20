import express, { Request, Response } from 'express';

import { getAllPartner, updatePartnerById } from "../models/partner";
import { sendResponse } from "../services/SendResponse";

const partnerRouter = express.Router();

/**
 * Get partner from home page
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
partnerRouter.get('/partner', async (req: Request, res: Response) => {
    try {
        const partner = await getAllPartner();
        sendResponse(res, partner, 'partner not found');
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving partnerHome from database', error: err });
    }
});

/**
 * Update partner from home page
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @throws {Error}
 */
partnerRouter.post('/partner/update', async (req: Request, res: Response) => {
    const { name, media, idPartner } = req.body;
    try {
        const partner = await updatePartnerById(name, media, idPartner);
        sendResponse(res, partner, 'partner not updated');
    } catch (err) {
        res.status(500).json({ message: 'Error updating updatePartner from database', error: err });
    }
});

export default partnerRouter;