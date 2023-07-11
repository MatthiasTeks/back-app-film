import express, { Request, Response } from 'express';
import Joi, { Schema } from 'joi';
import jwt from 'jsonwebtoken';
import { getUserByMail } from "../models/user";
import { postUser } from '../models/user';
import { hashPassword, verifyUserPassword } from '../middleware/passwordMiddlewares';
import { User } from "../interface/Interface";

const validateUser = (data: any) => {
    const schema: Schema<User> = Joi.object({
        mail: Joi.string().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
};

const userRouter = express.Router();

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

userRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { error } = validateUser(req.body);

        console.log(req.body);

        if (error) {
            return res.status(400).json('{ error: error.details }');
        }


        const { mail, password } = req.body;
        const admin = await getUserByMail(mail);

        if (!admin) {
            return res.status(401).send("Invalid credentials");
        }

        const isPasswordCorrect = await verifyUserPassword(password, admin.password);
        
        if (!isPasswordCorrect) {
            console.log("error")
            return res.status(401).send("Invalid credentials");
        }

        if(admin.is_admin !== 1){
            return res.status(401).send("User don't have admin permission")
        }

        const tokenUserInfo = {
            mail: mail,
            is_admin: true,
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

userRouter.post("/sign-up", hashPassword, async (req: Request, res: Response) => {
    try {
        const { error } = validateUser(req.body);

        if (error) {
            return res.status(400).json({ error: error.details });
        }

        const { mail, password, is_admin = 1 } = req.body;

        const response = await postUser({mail, password, is_admin})

        if (response) {
            res.status(200).send({ message: "User created successfully" });
        } else {
            res.status(500).send({ message: "Failed to create user" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user");
    }
});

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