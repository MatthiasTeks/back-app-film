import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import {findAdminByMail, hashingOptions, verifyAdminPassword} from "../models/auth";
import argon2 from "argon2";
import {Admin} from "../interface/Interface";
import {createDBConnection} from "../config/database";

const authRouter = express.Router();

/**
 * Retrieves the token from the request's authorization header or query parameter.
 * @function
 * @param {Request} req - The request object.
 * @returns {string | null} - Returns the token as a string if found, or null if not found.
 */
const getToken = (req: Request): string | null => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
        return req.query.token as string;
    }
    return null
};

/**
 * Handles the login process for an admin user.
 * Verifies the user's email and password, then generates and sends a JWT token.
 * @route {POST} /login
 * @param {Request} req - The request object, containing the email and password in the request body.
 * @param {Response} res - The response object, used to send status and token back to the client.
 */
authRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const admin = await findAdminByMail(email);

        if (!admin) {
            return res.status(401).send("Invalid credentials");
        }

        const passwordIsCorrect = await verifyAdminPassword(password, admin.password);
        if (!passwordIsCorrect) {
            return res.status(401).send("Invalid credentials");
        }

        const tokenUserInfo = {
            email: email,
            status: 'PouletMaster'
        };

        const token = jwt.sign(tokenUserInfo, process.env.JWT_SECRET as string);

        res.header('Access-Control-Expose-Headers', 'x-access-token')
        res.set('x-access-token', token)
        res.status(200).send({ mess: 'admin connected' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error to find a user');
    }
});

authRouter.post("/admin", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Hash the admin's password
        const hashedPassword = await argon2.hash(password, hashingOptions);

        const sql = 'INSERT INTO admin (mail, password) VALUES (?, ?)'

        // Insert the new admin into the database
        const connection = await createDBConnection();
        const result = await connection.query(sql, [email, hashedPassword]);
        connection.release();

        // Return a success response
        res.status(200).send({ message: "Admin created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating admin");
    }
});

/**
 * Verifies if the token provided in the request is valid, granting or denying access to a protected resource.
 * @route {POST} /protected
 * @param {Request} req - The request object, containing the token either in the authorization header or as a query parameter.
 * @param {Response} res - The response object, used to send the access status back to the client.
 */
authRouter.post('/protected', (req: Request, res: Response) => {
    const token = getToken(req)
    jwt.verify(token as string, process.env.JWT_SECRET as string, (err) => {
        if (err) {
            return res.status(403).send({ access: false })
        } else {
            return res.status(200).send({ access: true })
        }
    })
});


export default authRouter