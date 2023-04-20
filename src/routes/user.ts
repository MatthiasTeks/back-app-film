import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import {getUserByMail, hashingOptions, verifyAdminPassword} from "../models/user";
import argon2 from "argon2";
import {createDBConnection} from "../config/database";

const userRouter = express.Router();

/**
 * Retrieves the token from the request's authorization header or query parameter.
 * @param {Request} req
 * @returns {string | null}
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
 * Verifies the user's email, password and if it has admin rules, then generates and sends a JWT token.
 * @param {Request} req
 * @param {Response} res
 */
userRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password, is_admin } = req.body;
        const admin = await getUserByMail(email);

        if (!admin) {
            return res.status(401).send("Invalid credentials");
        }

        const passwordIsCorrect = await verifyAdminPassword(password, admin.password);
        if (!passwordIsCorrect) {
            return res.status(401).send("Invalid credentials");
        }

        if(is_admin !== 1){
            return res.status(401).send("User dont have admin permission")
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

userRouter.post("/sign-up", async (req: Request, res: Response) => {
    try {
        const { email, password} = req.body;

        // modify this line if you want to create new admin
        const isAdmin = 0;

        const hashedPassword = await argon2.hash(password, hashingOptions);

        const sql = 'INSERT INTO user (mail, password, is_admin) VALUES (?, ?, ?)'

        // Insert the new admin into the database
        const connection = await createDBConnection();
        await connection.query(sql, [email, hashedPassword, isAdmin]);
        connection.release();

        res.status(200).send({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user");
    }
});

/**
 * Verifies if the token provided in the request is valid, granting or denying access to a protected resource.
 * @param {Request} req
 * @param {Response} res
 */
userRouter.post('/protected', (req: Request, res: Response) => {
    const token = getToken(req)
    jwt.verify(token as string, process.env.JWT_SECRET as string, (err) => {
        if (err) {
            return res.status(403).send({ access: false })
        } else {
            return res.status(200).send({ access: true })
        }
    })
});


export default userRouter