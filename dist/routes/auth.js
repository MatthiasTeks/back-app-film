"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth = require('../models/auth');
const jwt = require('jsonwebtoken');
const authRouter = express_1.default.Router();
/* GET TOKEN FROM USER */
const getToken = req => {
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
};
/* CREATE NEW ADMIN */
authRouter.post('/create', (req, res) => {
    const { email } = req.body;
    let validationErrors = null;
    Auth.findByEmail(email)
        .then((existingUserWithEmail) => {
        if (existingUserWithEmail)
            return Promise.reject('DUPLICATE_EMAIL');
        validationErrors = Auth.validate(req.body);
        if (validationErrors)
            return Promise.reject('INVALID_DATA');
        return Auth.create(req.body);
    })
        .then((createdUser) => {
        res.status(201).json(createdUser);
    })
        .catch((err) => {
        console.error(err);
        if (err === 'DUPLICATE_EMAIL')
            res.status(409).json({ message: 'This email is already used' });
        else if (err === 'INVALID_DATA')
            res.status(422).json({ validationErrors });
        else
            res.status(500).send('Error saving the user');
    });
});
/* CONNEXION TO ADMIN PANEL */
authRouter.post("/login", (req, res) => {
    const { email, password } = req.body;
    Auth.findByEmail(email)
        .then((admin) => {
        if (!admin)
            res.status(401).send("Invalid credentials");
        else {
            /* VERIFY PASSWORD */
            Auth.verifyPassword(password, admin.password)
                .then((passwordIsCorrect) => {
                if (passwordIsCorrect) {
                    const tokenUserInfo = {
                        email: email,
                        status: 'PouletMaster'
                    };
                    console.log('log', tokenUserInfo);
                    return tokenUserInfo;
                }
                else
                    res.status(401).send("Invalid credentials");
            })
                /* STORE TOKEN ON NAVIGATOR */
                .then(tokenUserInfo => {
                if (tokenUserInfo !== undefined) {
                    console.log('token', tokenUserInfo);
                    const token = jwt.sign(tokenUserInfo, process.env.JWT_SECRET);
                    res.header('Access-Control-Expose-Headers', 'x-access-token');
                    res.set('x-access-token', token);
                    console.log('succed');
                    res.status(200).send({ mess: 'admin connected' });
                }
            })
                .catch(err => {
                console.error(err);
                if (err === 'USER_NOT_FOUND')
                    res.status(404).send('User not found');
                else if (err === 'ERROR_IDENTIFICATION')
                    res.status(404).send('Erreur identification');
                else
                    res.status(500).send('Error to find a user');
            });
        }
    });
});
/* VERIFY NAVIGATOR TOKEN TO AUTHORIZE ACCESS TO ADMIN PAGE */
authRouter.post('/protected', (req, res) => {
    const token = getToken(req);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            return res.status(403).send({ access: false });
        }
        else {
            return res.status(200).send({ access: true });
        }
    });
});
exports.default = authRouter;
