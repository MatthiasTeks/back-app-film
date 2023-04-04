"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../models/auth");
const authRouter = express_1.default.Router();
/**
 * Retrieves the token from the request's authorization header or query parameter.
 * @function
 * @param {Request} req - The request object.
 * @returns {string | null} - Returns the token as a string if found, or null if not found.
 */
const getToken = (req) => {
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
};
/**
 * Handles the login process for an admin user.
 * Verifies the user's email and password, then generates and sends a JWT token.
 * @route {POST} /login
 * @param {Request} req - The request object, containing the email and password in the request body.
 * @param {Response} res - The response object, used to send status and token back to the client.
 */
authRouter.post("/login", (req, res) => {
    const { email, password } = req.body;
    (0, auth_1.findAdminByMail)(email)
        .then((admin) => {
        if (!admin)
            res.status(401).send("Invalid credentials");
        else {
            /* VERIFY PASSWORD */
            (0, auth_1.verifyAdminPassword)(password, admin.password)
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
                    const token = jsonwebtoken_1.default.sign(tokenUserInfo, process.env.JWT_SECRET);
                    res.header('Access-Control-Expose-Headers', 'x-access-token');
                    res.set('x-access-token', token);
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
/**
 * Verifies if the token provided in the request is valid, granting or denying access to a protected resource.
 * @route {POST} /protected
 * @param {Request} req - The request object, containing the token either in the authorization header or as a query parameter.
 * @param {Response} res - The response object, used to send the access status back to the client.
 */
authRouter.post('/protected', (req, res) => {
    const token = getToken(req);
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.status(403).send({ access: false });
        }
        else {
            return res.status(200).send({ access: true });
        }
    });
});
exports.default = authRouter;
//# sourceMappingURL=auth.js.map